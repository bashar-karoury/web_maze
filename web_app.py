#!/usr/bin/python3
from datetime import timedelta
from flask import Flask, jsonify, make_response, request, send_file
from data_manager import close_session, Player, Level
from data_manager import get_players_usernames, add_to_database, get_user_password, update_player_data, get_top_players, get_player_data
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
app = Flask(__name__)
# cors = CORS(app, resources={r"*": {"origins": "*"}})
CORS(app)
app.config['JWT_SECRET_KEY'] = '17c57c8ed4dfd13f291743aa243ff6d12e545e98b8e4e331'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=120)
jwt = JWTManager(app)

@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    # close_session()
    pass


@app.route('/game', methods=['GET'])
def authenticate():
    # return authenitcaiton page
    return send_file('authen.html'), 200
# Authentication Api

# register
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = request.json.get('username')
    password = request.json.get('password')
    print(username, password)

    # if not json
    if not request.json:
        return make_response(jsonify({'error': "Not json"}), 404)
    
    # if no there isn't username or password
    if not username or not password:
        return make_response(jsonify({'error': "username or password missing"}), 404) 
    
    # if username already exist
    if username in get_players_usernames():
        return make_response(jsonify({'error': "username already exist"}), 404)

    # create new player with new password
    hashed_password = generate_password_hash(password)
    add_to_database(Player(username=username, password=hashed_password))
    print("user signed up successfully")

    # return the created jwt token
    return make_response(jsonify({'registered': True})), 201



# login
@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    # if not json
    if not request.json:
        return make_response(jsonify({'error': "Not json"}), 401)
    
    # if no there isn't username or password
    if not username or not password:
        return make_response(jsonify({'error': "username or password missing"}), 401)
    
    # if username isn't registered in database or incorrect password
    if not (username in get_players_usernames()) or not check_password_hash(get_user_password(username), password):
        return jsonify({"msg": "Invalid credentials"}), 401
    print("Welcome to Web Maze")
    # redirect to game page
    # Generate JWT token
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200

@app.route('/api/top_players', methods=['GET'])
@jwt_required()
def top_players():
    current_user = get_jwt_identity()
    print(current_user)
    # get next level config
    result = get_top_players()
    return jsonify(top=result), 200


@app.route('/api/players_data/<username>', methods=['POST'])
@jwt_required()
def set_user_info(username):
    current_user = get_jwt_identity()
    if current_user != username:
         return make_response(jsonify({'error': "username isn't the same"}), 401)
    # set score and new level of the user
    player_data = request.get_json()
    update_player_data(username, player_data)
    return jsonify(get_player_data(username)), 200

@app.route('/api/players_data/<username>', methods=['GET'])
@jwt_required()
def get_uesr_info(username):
    # no need for check for username 
    # current_user = get_jwt_identity()
    # if current_user != username:
    #     return make_response(jsonify({'error': "username isn't the same"}), 401)
    return jsonify(get_player_data(username)), 200

if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5600, debug=True)
