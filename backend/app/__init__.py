from flask import Flask, request, session
from flask_cors import CORS
import os
from random import choice

def get_solution_word():
    fn_possible_words = os.path.join(os.path.dirname(__file__), 'possible_words.txt')

    with open(fn_possible_words,'r') as f:
        words = f.read().splitlines()

    return choice(words)

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev'
    )

    if test_config is None:
        app.config.from_pyfile('config.py',silent=True)
    else:
        app.config.from_mapping(test_config)
    
    CORS(app)

    @app.before_request
    def before_request():
        if 'solution_word' not in session:
            session['solution_word'] = get_solution_word()
        
    @app.route('/hello')
    def hello_world():
        return {'return':'Hello World!'}
    
    @app.route('/reset-game', methods=['POST'])
    def reset_game():
        session['solution_word'] = get_solution_word()

        return {'result':'success',
                'solution_word':session['solution_word']}

    @app.route('/validate-guess', methods=['POST'])
    def validate_guess():
        data = request.json
        guess = ''.join(data['currentGuess'])
        
        fn_possible_words = os.path.join(os.path.dirname(__file__), 'possible_words.txt')

        with open(fn_possible_words,'r') as f:
            words = f.read().splitlines()

        solution_word = session['solution_word']

        if guess == solution_word:
            return_data = {'result':'correct'}

            for i,_ in enumerate(guess):
                return_data[f'letter{i}'] = 'correct_location'

            return return_data
        
        if guess in words:
            return_data = {'result':'valid'}
            
            for i,letter in enumerate(guess):
                return_data[f'letter{i}'] = 'wrong_letter'
                if letter in solution_word:
                    return_data[f'letter{i}'] = 'correct_letter'
                if letter == solution_word[i]:
                    return_data[f'letter{i}'] = 'correct_location'
            
            return return_data
        
        return {'result':'not valid'}


    return app
