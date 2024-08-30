from flask import Flask, request, session, render_template
from flask_cors import CORS
import os
from random import choice
from dotenv import load_dotenv

def get_solution_word():
    fn_possible_words = os.path.join(os.path.dirname(__file__), 'possible_words.txt')

    with open(fn_possible_words,'r') as f:
        words = f.read().splitlines()

    return choice(words)

def create_app(test_config=None):
    load_dotenv()

    app = Flask(__name__, instance_relative_config=True,
               static_folder='../../frontend/wordle-clone/build',
               template_folder='../../frontend/wordle-clone/build')
    app.config.from_mapping(
        SECRET_KEY=os.getenv('SECRET_KEY','dev'),
        ENV = os.getenv('ENV','dev')
    )

    if test_config is None:
        app.config.from_pyfile('config.py',silent=True)
    else:
        app.config.from_mapping(test_config)
    
    if app.config['ENV'] == 'dev':
        CORS(app)

    @app.before_request
    def before_request():
        if 'solution_word' not in session:
            session['solution_word'] = get_solution_word()
        
    @app.route('/hello')
    def hello_world():
        return {'return':'Hello World!'}
    
    @app.route('/')
    def serve():
        return render_template('index.html')
    
    @app.route('/<path:path>')
    def static_proxy(path):
        if os.path.exists(os.path.join(app.static_folder, path)):
            return app.send_static_file(path)
        return app.send_static_file('index.html')
    
    @app.route('/reset-game', methods=['POST'])
    def reset_game():
        session['solution_word'] = get_solution_word()

        return {'result':'success',
                'solution_word':session['solution_word']}

    @app.route('/validate-guess', methods=['POST'])
    def validate_guess():
        data = request.json
        guess = ''.join(data['currentGuess'])
        final_guess = False
        if data['guessIndex'] == 5:
            final_guess = True
        
        fn_possible_words = os.path.join(os.path.dirname(__file__), 'possible_words.txt')

        with open(fn_possible_words,'r') as f:
            words = f.read().splitlines()

        solution_word = session['solution_word']

        if guess == solution_word:
            return_data = {'result':'correct',
                           'solutionWord': solution_word}


            for i,_ in enumerate(guess):
                return_data[f'letter{i}'] = 'correct_location'

            return return_data
        
        if guess in words:
            return_data = {'result':'valid',
                           'solutionword':'hiden'}
            
            for i,letter in enumerate(guess):
                return_data[f'letter{i}'] = 'wrong_letter'
                if letter in solution_word:
                    return_data[f'letter{i}'] = 'correct_letter'
                if letter == solution_word[i]:
                    return_data[f'letter{i}'] = 'correct_location'

            if final_guess:
                return_data['solutionWord'] = solution_word
            
            return return_data
        
        return {'result':'not valid'}


    return app
