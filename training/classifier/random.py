import random

from classifier.base import MoveClassifier

class RandomClassifier(MoveClassifier):
    def classify_move_san(self, move_san):
        return [random.random(), 0, 0]
        
    def classify_move_images(self, move_images):
        return [[1.0, 0.2, 0.3] for img in move_images]
