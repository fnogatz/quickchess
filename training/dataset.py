import os
import json
import sys
import tensorflow as tf

# TODO: turn this into a class

HEIGHT = 30
WIDTH = 70

# TODO: make this configurable
DATASET_NAME = "testset-20220413"

def load_json(filename):
    with open(filename, 'r') as f:
        return json.load(f)

def load_test_dataset():
    # TODO: use flag
    return load_json('data/' + DATASET_NAME + '/games.json')

def limit_notations(games, notation_limit):
	for game in games:
		game['notations'] = game['notations'][:notation_limit]

def load_notation_images(game):
    notations = game['notations']
    return [load_move_images(game['gameId'], n['pictureId'], len(game['moves']))
            for n in notations]

def load_move_images(game_id, picture_id, move_count):
    prefix = 'data/' + DATASET_NAME + '/images/moves/' + game_id + '-' + picture_id + '-'
    filenames = [prefix + "%03d" % i + '.png' for i in range(move_count)]
    images = list(map(load_image, filenames))
    images = tf.convert_to_tensor(images)
    return images

def load_image(filename):
    img = tf.io.read_file(filename)
    img = tf.image.decode_png(img, channels=1)
    img = tf.image.resize(img, [HEIGHT, WIDTH])
    img = img / 255.0
    return img

if __name__ == '__main__':
    print(load_json(sys.argv[1]))
