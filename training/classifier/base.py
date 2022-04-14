# Abstact move classifier
class MoveClassifier:
    # Returns a tensor representing the given move SAN
    # The dimension of the tensor can be chosen by the implementation, but needs to match classify_move_images. 
    def classify_move(self, move, board):
        raise Exception("Method not implemented by subclass")

    # Classify the given move images (e.g. using a neural net).
    # GameEval will multiply the tensor with each possible move tensor to calculate the scores.
    def classify_move_images(self, move_images):
        raise Exception("Method not implemented by subclass")

    def classify_notations(self, game):
        return
