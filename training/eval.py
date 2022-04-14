import chess
import tensorflow as tf

import dataset
from classifier.alpha import AlphaClassifier

class GameEval():
    def __init__(self, classifier, debug_level):
        self.classifier = classifier
        self.debug_level = debug_level

    def eval_games(self, games):
        """ Evaluates classifier performance over a list of games
         
        games -- a game list of games from a dataset
        """
        if self.debug_level <= 500:
            print("Number of games to evaluate:", len(games))

        stats = []
        for game in games:
            stats.extend(self.eval_game(game))

        if self.debug_level <= 500:
            print("Number of games:", len(games))
            self.print_stats(stats)
        return stats

    def eval_game(self, game):
        """ Evaluate a single game
        
        game -- a game object from a dataset
        """
        # Load the move images for all notations of this game
        notations = dataset.load_notation_images(game)

        # Run classifier over all images
        predictions = [classifier.classify_move_images(n) for n in notations]

        # Zip together the different notations for each move
        predictions = list(zip(*predictions))

        board = chess.Board()
        stats = []
        for i, actual_move in enumerate(game['moves']):
            stats.append(self.eval_move(board, predictions[i], actual_move))
            if self.debug_level <= 250:
                print("Executing move", actual_move)
            board.push(board.parse_san(actual_move))
        if self.debug_level <= 300:
            self.print_stats(stats)
        return stats

    def eval_move(self, board, predictions, actual_move):
        """Evaluates how accurate the classifier predicted the actual move
        Returns a tupel (position of actual move in predictions, number of possible moves)

        board -- the current chess board
        predictions -- the list of predictions by the MoveClassifier for each image of the move 
        actual_move -- the move that was actually played and that we evaluate against
        """
        if self.debug_level <= 200:
            print("Evaluating move", actual_move)
            print("Predictions", predictions)
        scored_moves = [(move, self.score_move_candidate(predictions, move, board)) for move in board.legal_moves]
        scored_moves = sorted(scored_moves, key=lambda x: x[1], reverse=True)

        if self.debug_level <= 100:
            print("Possible moves with score:")
            for (move, score) in scored_moves:
                print(board.san(move), score)

        for index, (move, score) in enumerate(scored_moves):
            if board.san(move) == actual_move:
                if self.debug_level <= 200:
                    print("Actual move found at position ", index)
                return (index, len(scored_moves))
        print("ERROR! actual_move not found in possible_moves!")
        print(board)
        print("Actual move:", actual_move)
        print("Possible moves:")
        for move in board.legal_moves:
            print(board.san(move))

    def score_move_candidate(self, predictions, move, board):
        """Calculates the score for a single move

        predictions -- the predictions returned by the MoveClassifier for each image of the move
        move -- the possible move to score
        board -- the current chess board
        """
        move_classes = self.classifier.classify_move(move, board)
        if self.debug_level <= 20:
            print("Move classes:", board.san(move), move_classes)
        score = 1.0
        for prediction in predictions:
            for move_class, pred in zip(move_classes, prediction):
                if move_class == 1.0:
                    # This class is part of the move, add to the score
                    score *= pred
                elif move_class == 0.0:
                    # This class is not part of the move, subtract from the score
                    # This is needed to ensure moves that have less classes don't have an unfair advantage in scoring
                    score *= 1 - pred
                else:
                    raise Exception("Invalid move classification. Only binary classes allowed")
        return score

    def print_stats(self, move_positions):
        position_counts = [0, 0, 0, 0] # keep track of how often we suggest which position
        position_average = 0.0
        for (position, possible_moves_count) in move_positions:
            position_counts[min(position, len(position_counts)-1)] += 1
            position_average += float(position)
        position_counts = [x / float(len(move_positions)) for x in position_counts]
        position_average /= len(move_positions)
        print("Number of moves:", len(move_positions))
        print("Actual move @1:", position_counts[0])
        print("Actual move @2:", position_counts[1])
        print("Actual move @3:", position_counts[2])
        print("Actual move @4+", position_counts[3])
        print("Average position of actual move:", position_average)

if __name__ == '__main__':
    classifier = AlphaClassifier()
    classifier.load_model('model/alpha-model3.h5')
    eval = GameEval(classifier, 500)

	# Evaluate with all notations
    data = dataset.load_test_dataset()
    eval.eval_games(data)
    
    # Evaluate with a single notation
    dataset.limit_notations(data, 1)
    eval.eval_games(data)
