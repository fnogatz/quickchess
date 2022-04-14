# Quick Chess - OCR for chess game notations

## Motivation

Organizers of chess tournaments spend thousands of hours every year
digitizing chess games from handwritten game notation forms. While
general purpose offline handwriting recognition is still an unsolved
problem, the number of possible chess moves is heavily restricted, thus
making OCR for chess game notations a very feasible problem.

## Current status

**This project is experimental and work in progress.** Currently there's
a webapp for creating and annotating training data and some simple
python scripts that create a tensorflow model for classifying images of
moves into chess moves.

### Current performance

`training/data/testset-20220413` is a very small real-world dataset with
just three games. Each game has the notations from both players.

`training/model/alpha-model3.h5` is a deep neural net trained on a
hundred or so game notations. Performance for `testset-20220413`:

```
Number of games: 3
Number of moves: 199
Actual move @1: 0.271356783919598
Actual move @2: 0.1457286432160804
Actual move @3: 0.06532663316582915
Actual move @4+ 0.5175879396984925
Average position of actual move: 5.658291457286432
```

If limited to only one notation per game, the performance is as follows:

```
Number of games: 3
Number of moves: 199
Actual move @1: 0.23115577889447236
Actual move @2: 0.1407035175879397
Actual move @3: 0.08542713567839195
Actual move @4+ 0.542713567839196
Average position of actual move: 7.391959798994975
```


## Workflows

### Adding games and notation images

* Make sure `webapp/src/environment/environment.ts` contains the firebase keys for your firebase project
* `npm start` inside `webapp` to start the frontend
* Open the frontend in your browser `http://localhost:4200/#/`
* Select the tournament
	* The only way to create a new tournament at the moment is directly in the Firebase Console. Go to *Firestore Database* and add a new document to the `tournaments` collection. It only needs a `name` field at the moment.
* After selecting a tournament, you are on the `/tournaments/:t/databases` route. Use the upload button in the bottom right to upload one or more pgn files.
	* For generating training data, the pgn file should already have the moves for all games. One day users would be able to upload pgn files without the moves and use the app to enter the moves and then export the completed pgn.
	* This will call `DatabaseService.uploadPgn`
	* It will create a new document in the Firestore under `tournaments/:t/databases` with the pgn's filename in the `name` field
	* It will also create a new document under `tournaments/:t/games` for each game in the pgn
	* This contains a `databaseId` reference as well as a `pgn` field with all the game data in a string field
* Go to the `/tournaments/:t/notations` route. Here you can upload new jpg photos of game notations
	* This will call `PictureService.uploadPicture`
	* It will create a new document in the Firestore under `tournaments/:t/pictures` with the filename of the picture in the `filename` field
	* It will store the image in the firebase storage under `notations/original/<pictureId>.jpg`
* Click on the notation picture, this will open the `NotationDialog`
	* Use the rotate button to rotate the image, if neccessary
	* Move the red grid across the image to position it over the moves. Currently there aren't any controls for configuring the spacing between columns, but that's already supported in code. During export there's always some space outside of the red boxes that is also exported and taken into account during classification (e.g. lower-case g will usually be outside the box).
	* Use the input field at the bottom of the dialog to specify which game this notation belongs to (you can select from all the games contained in the pgn files you previously uploaded for that tournament)
	* Do **not** use the export buttons, these were used for previous training data format
	* Hit the Save button
	* The status in the picture list should now show as `true`, indicating that the picture was assigned to a game.
  
### Creating training data

**Note:** This is changing rapidly and there are some hacks in the code, so have a look through the code before using this.

* Go to `tournaments/:t/training/exportmoves`
* This lists a game that has not been exported yet (`trainingDataExported` field not set on the game)
* Annotate the quality of moves as described on the page in order to exclude bad training data from the training
* Hit *Export* (or *Export test data*)
	* This will store in move images in Firebase storage under `{training|test}/moves-v2/{gameId}-{pictureId}-{moveIndex}.png`
	* It will add a document to the `trainingdata-v2` or `testdata-v2` collection
* You can export datasets via `/export/trainingdata` (check code for what's exported currently)
  
*TODO*: add example of trainingdata format

*Note:* There's also a `tournaments/:t/training/playernotations` route that was previously used to annotate which player wrote the game notation. The idea was to make sure that the training and evaluation can avoid using players who's handwriting was present in the training set. That said, it seems a lot easier to just get sufficient training data to make sure we can just use different tournaments for training and test data sets.
 
  
## Directories

* `training` new training and evaluation code, heavily work in progress
	* `classifier` different classifiers that classify images of moves.
	* `data` the exported training and test data sets
	* `model` generated tensorflow models
* `webapp` Angular + firebase frontend used for generating test data that will later be used as the actual app for scanning notations.


## TODO list

* Upload to github
	* Don't check in environment vars
	* Check all the files whether it's appropriate to check in
	* Check all the move images
* Figure out current state of training data / number of exported games etc.
* Train again on current training data
	* Document progress with number of games trained on
* Export more of the existing training data
* Use BEM 2018 for yet more training data
