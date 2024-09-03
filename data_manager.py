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
    password = Column(String(60))
    level = Column(Integer, ForeignKey('levels.id'), nullable=False)

    def __init__(self, *args, **kwargs):
        """Initialization of the Player"""
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
    session.commit()

def get_top_scores():
    """ Get list of top scorers """
    pass
