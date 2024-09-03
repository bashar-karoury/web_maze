#!/usr/bin/python3
from flask import Flask, jsonify, make_response, request
from data_manager import close_session, Player, Level
from data_manager import get_players_usernames, add_to_database, getUserPassword, getUserNextLevel, getTopPlayers
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = '17c57c8ed4dfd13f291743aa243ff6d12e545e98b8e4e331'
jwt = JWTManager(app)

@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    close_session()


@app.route('/', methods=['GET'])
def non_protected():

    return "non protected\n", 200

# xxxxxxxxx
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    print(current_user)
    return jsonify(logged_in_as=current_user), 200

# Authentication Api

# register
@app.route('/register', methods=['POST'])
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
    return "registered\n", 201



# login
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    # if not json
    if not request.json:
        return make_response(jsonify({'error': "Not json"}), 401)
    
    # if no there isn't username or password
    if not username or not password:
        return make_response(jsonify({'error': "username or password missing"}), 401)
    
     # if username isn't registered in database
    if username not in get_players_usernames():
        return make_response(jsonify({'error': "username doesn't exist"}), 401)
    
    if not (username in get_players_usernames()) or not check_password_hash(getUserPassword(username), password):
        return jsonify({"msg": "Invalid credentials"}), 401
    print("Welcome to Web Maze")
    # redirect to game page
    XXXXXXXXXXXXXXXXXXXXXXXXXXXX
    # Generate JWT token
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200

# @app.route('/next_level', methods=['GET'])
# @jwt_required()
# def get_next_level():
#     current_user = get_jwt_identity()
#     print(current_user)
#     # get next level config
#     result = getUserNextLevel(current_user)
#     return jsonify(config=result), 200


@app.route('/top_players', methods=['GET'])
@jwt_required()
def get_top_players():
    current_user = get_jwt_identity()
    print(current_user)
    # get next level config
    result = getTopPlayers()
    return jsonify(top=result), 200

XXXXXXXXXXXXXX change route to /user_name/info or config
@app.route('/user_info', methods=['POST'])
@jwt_required()
def set_user_info():
    current_user = get_jwt_identity()
    print(current_user)
    # set score and new level of the user
    result = getTopPlayers()

    # return the new level config

    return jsonify(top=result), 200

@app.route('/user_info', methods=['GET'])
@jwt_required()
def get_uesr_info():
    current_user = get_jwt_identity()
    print(current_user)
    # get score and level of the user
    # json user_info = {username:"username", score:user_score, level_number:number, level_config{
    #                                                                                              squre_size:
    #                                                                                              maze_width:   
    #                                                                   
    #                                                                                           }
    #                   }
    return jsonify(user_info), 200

if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5500, debug=True)
