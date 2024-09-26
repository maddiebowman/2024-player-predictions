from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import pandas as pd
import os
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

# Define column order for each selected position (dashboard grid)
QB_COLUMNS = ['position_fantasy_rank', 'total_fantasy_rank', 'fantasy_points_ppr', 'player_name', 'team', 'total_yards', 'passing_yards', 'rushing_yards', 'total_tds', 'pass_td', 'run_td', 'rush_attempts', 'pass_attempts', 'complete_pass', 'incomplete_pass', 'interception']
WR_COLUMNS = ['position_fantasy_rank', 'total_fantasy_rank', 'fantasy_points_ppr', 'player_name', 'team', 'total_yards', 'receiving_yards', 'touches', 'targets', 'receptions', 'yards_after_catch', 'total_tds', 'reception_td', 'run_td']
RB_COLUMNS = ['position_fantasy_rank', 'total_fantasy_rank', 'fantasy_points_ppr', 'player_name', 'team', 'total_yards', 'rushing_yards', 'rush_attempts', 'touches', 'targets', 'receptions',  'yards_after_catch', 'total_tds', 'run_td', 'reception_td']
TE_COLUMNS = ['position_fantasy_rank', 'total_fantasy_rank', 'fantasy_points_ppr', 'player_name', 'team', 'total_yards', 'receiving_yards', 'touches', 'targets', 'receptions', 'yards_after_catch', 'total_tds', 'reception_td']

# Define player popup columns
POPUP_COLUMNS = ['player_name', 'position', 'team', 'position_fantasy_rank', 'age', 'height', 'weight', 'draft_ovr', 'seasons_played']

# Reorder columns
def reorder_columns(df, columns_order):
    missing_cols = [col for col in columns_order if col not in df.columns]
    if missing_cols:
        print(f"Warning: Missing columns in data: {missing_cols}")
    return df[columns_order]

# Flask endpoints/available routes and rendered templates
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/score')
def score():
    return render_template('score.html')

@app.route('/teams')
def teams():
    return render_template('teams.html')

@app.route('/superbowl')
def superbowl():
    return render_template('superbowl.html')

@app.route('/fantasy')
def fantasy():
    return render_template('fantasy.html')

@app.route('/rookie')
def rookie():
    return render_template('rookie.html')

@app.route('/qb')
def qb():
    return render_template('qb.html')

@app.route('/rb')
def rb():
    return render_template('rb.html')

@app.route('/wr')
def wr():
    return render_template('wr.html')

@app.route('/te')
def te():
    return render_template('te.html')

@app.route('/dst')
def dst():
    return render_template('dst.html')

# Pull in fantasy predictive data
@app.route('/get_data/<position>', methods=['GET'])
def get_data(position):
    # Load CSV for each position
    if position == 'qb':
        df = pd.read_csv('data/qb_data.csv')
        main_columns = QB_COLUMNS
    elif position == 'wr':
        df = pd.read_csv('data/wr_data.csv')
        main_columns = WR_COLUMNS
    elif position == 'rb':
        df = pd.read_csv('data/rb_data.csv')
        main_columns = RB_COLUMNS
    elif position == 'te':
        df = pd.read_csv('data/te_data.csv')
        main_columns = TE_COLUMNS
    else:
        return jsonify({'error': 'Invalid position selected'}), 400

    # Prepare dashboard data
    main_data = reorder_columns(df[main_columns], main_columns).to_dict(orient='records')

    # Prepare popup data
    popup_data = df[POPUP_COLUMNS].to_dict(orient='records')

    return jsonify({
        'main_data': main_data,
        'main_columns': main_columns,
        'popup_data': popup_data,
        'popup_columns': POPUP_COLUMNS
    })

# Get weekly scoring data
@app.route('/api/scores/<int:week>', methods=['GET'])
def get_scores(week):
    url = f"https://www.pro-football-reference.com/years/2024/week_{week}.htm"
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        games = soup.select('#games tbody tr')
        
        scores = []
        for game in games:
            winner = game.select_one('.winner')
            loser = game.select_one('.loser')
            if winner and loser:
                scores.append({
                    'date': game.select_one('.date').text,
                    'winner': winner.select_one('a').text,
                    'winnerScore': winner.select_one('.score').text,
                    'loser': loser.select_one('a').text,
                    'loserScore': loser.select_one('.score').text
                })
        
        return jsonify(scores)
    except requests.RequestException as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)