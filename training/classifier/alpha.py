import chess
import tensorflow as tf

from classifier.base import MoveClassifier

class AlphaClassifier(MoveClassifier):
    '''
    The Alpha classifier uses a single neural net to classify whether an image belongs into these classes:
    0:  'piece-p',
    ... 'piece-n', 
        'piece-b', 
        'piece-r', 
        'piece-q', 
        'piece-k',
    6:  'O-O',
    7:  'O-O-O',
    8:  'capture',
    9:  'file-a',
    ... 'file-b',
        'file-c',
        'file-d',
        'file-e',
        'file-f',
        'file-g',
        'file-h',
    17: 'row-1',
    ... 'row-2',
        'row-3',
        'row-4',
        'row-5',
        'row-6',
        'row-7',
    24: 'row-8'
    
    Obviously, most moves are part of one file and one row class as well as a piece class, whereas there
    are special classes for castling.
    
    TODO: Add classes for promotion, check and en passant (and anything else in SAN notation).
    '''

    def classify_move(self, move, board):
        classes = [0.0] * 25
        # Castling
        if board.is_kingside_castling(move):
            classes[6] = 1.0
        elif board.is_queenside_castling(move):
            classes[7] = 1.0
        else:
            # File
            classes[9 + chess.square_file(move.to_square)] = 1.0
            # Rank
            classes[17 + chess.square_rank(move.to_square)] = 1.0
            # Piece
            classes[board.piece_type_at(move.from_square) - 1] = 1.0
            # Capture
            if board.is_capture(move):
                classes[8] = 1.0
        return classes
        
    def classify_move_images(self, move_images):
        return self.model.predict(move_images, batch_size=len(move_images), steps=1)

    def load_model(self, filename):
        self.model = tf.keras.models.load_model(filename)
