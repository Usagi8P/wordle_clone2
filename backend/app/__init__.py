from flask import Flask, request, session
from flask_cors import CORS
import os

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)

    # @app.before_request
    # def before_request():
    #     if 'solution_word' not in session:
    #         session['solution_word'] = 'world'

    @app.route('/hello')
    def hello_world():
        return {'return':'Hello World!'}

    @app.route('/validate-guess', methods=['POST'])
    def validate_guess():
        data = request.json
        guess = ''.join(data['currentGuess'])
        
        possible_words = os.path.join(os.path.dirname(__file__), 'possible_words.txt')

        with open(possible_words,'r') as f:
            words = f.read().splitlines()

        session = {'solution_word':'WORLD'}
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
