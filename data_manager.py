#!/usr/bin/python3
""" Main Module which contains classes and basic function to add,
    remove, retrieve and update objects in database
"""
from sqlalchemy import create_engine, Column, Integer, String, JSON, ForeignKey
# from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
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
    level = Column(Integer, ForeignKey('levels.id'), nullable=False)

    def __init__(self, *args, **kwargs):
        """Initialization of the Player"""
        if kwargs:
            for key, value in kwargs.items():
                setattr(self, key, value)
        if not self.level:
            self.level = 1


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
    session.commit()

def get_top_scores():
    """ Get list of top scorers """
    pass

def close_session():
    """ close current session """
    session.close()

def get_players_usernames():
    """ gets list of usernames of all players"""
    result = [row[0] for row in session.query(Player.username).all() ]
    return result

def getUserPassword(user):
    """ returns password of player"""
    result = session.query(Player).filter(Player.username == user).first()
    return result.password