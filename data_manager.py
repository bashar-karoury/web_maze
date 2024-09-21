#!/usr/bin/python3
""" Main Module which contains classes and basic function to add,
    remove, retrieve and update objects in database
"""
from sqlalchemy import create_engine, Column, Integer, String, JSON, ForeignKey, desc
# from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.orm import declarative_base
Base = declarative_base()

# database variables
db_user = 'web_maze'
db_password = 'web_maze'
db_name = 'web_maze'

class Player(Base):
    """ player class """
    __tablename__ = 'players'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(60))
    password = Column(String(256))
    level_id = Column(Integer, ForeignKey('levels.id'), nullable=False)
    score = Column(Integer)
    level = relationship('Level')

    def __init__(self, **kwargs):
        """Initialization of the Player"""
        if kwargs:
            for key, value in kwargs.items():
                setattr(self, key, value)
        if not self.level_id:
            self.level_id = 1
        if not self.score:
            self.score = 0
    
    def to_dict(self):
        """ parse player data as dict"""
        new_dict = {}
        for key, value in (self.__dict__).items():
            if key == '_sa_instance_state' or key == 'password' or key == 'level':
               continue
            new_dict[key] = value
        return new_dict

    def update(self, **kwargs):
        """ update Player attributes """
        if kwargs:
            for key, value in kwargs.items():
                setattr(self, key, value)


class Level(Base):
    """ level class contains game level configuration """
    __tablename__ = 'levels'
    id = Column(Integer, primary_key=True)
    config = Column(JSON, nullable=False)
 
    def __init__(self, *args, **kwargs):
        """Initialization of the Level"""
        if kwargs:
            for key, value in kwargs.items():
                setattr(self, key, value)
    



# setup engine and session

engine = create_engine('mysql+mysqldb://{}:{}@localhost/{}'.format(db_user, db_password, db_name))
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()


def add_to_database(obj):
    """ Add object to database """
    session.add(obj)
    try:
        session.commit()
    except Exception as e:
        session.rollback()  # Rollback the transaction on exception
    finally:
        session.close()



def close_session():
    """ close current session """
    session.close()



def update_player_data(username, player_data):
    """ update player data """
    print("XXXXXXXXXXX updating player data");
    player = session.query(Player).filter(Player.username == username).first()
    player.update(**player_data)
    try:
        session.commit()
    except Exception as e:
        session.rollback()


def get_player_data(username):
    """ set score of username"""
    print("XXXXXXXXXXX getting player data");
    player = session.query(Player).filter(Player.username == username).first()
    print(player)
    player_data = player.to_dict()
    print(player_data)
    player_data['current_level_config'] = player.level.config
    return player_data


def get_players_usernames():
    """ gets list of usernames of all players"""
    return [row[0] for row in session.query(Player.username).all() ]


def get_user_password(username):
    """ returns password of player"""
    player = session.query(Player).filter(Player.username == username).first()
    return player.password



# def get_user_next_level(username):
#     """ return next level config for username"""
#     pass

def get_top_players():
    """ Get list of top scorers """
    results = session.query(Player.username, Player.score).order_by(desc(Player.score)).limit(5).all()
    print(results)
    tops = []
    for result in results:
        tops.append({'name':result[0], 'score':result[1]})
    # tops = [row[0] for row in results ]
    return tops
