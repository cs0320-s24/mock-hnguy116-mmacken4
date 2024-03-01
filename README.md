# Project Details

Project name: Mock
Team members: Macilee MacKenzie (mmacken4) + Havi Nguyen (hnguy116)
Repo: https://github.com/cs0320-s24/mock-hnguy116-mmacken4.git
Est. time: 25 hr

This project creates a mock interface through which users can input commands. The program takes these user commands and performs different actions, such as loading or searching a file. The results of these commands are displayed in a scrollable manner on the screen, and updates as users enter more commands. Mock mocks certain back end functionality, such as searching a file.

Command list:

- mode: used to switch between verbose and brief mode, which will affect how the result of running commands is displayed
- load_file: loads a file and keeps it loaded for users to access
- view: displays loaded file as html table to user
- search: searches loaded file for a value (w or w/o identifier) and displays matched rows as html table

# Design Choices

REPLInput class handles most logic for the program, including commands and their varying outputs. To extend functionality in our program, we created a REPLFunction interface that each command function implements. These command functions, ex. loadCommand and viewCommand, are added to a map that maps command names -> command functions. When the user inputs a command, the program checks if the command is in the map and calls the corresponsing function; if the command is not in the map the program returns an appropriate message to the user. Developers that use the program can write their own functions that implement REPLFunction, and add this function to the map so that the program recognizes it as a legitimate command. REPLHistory displays the history of commands in REPL.

# Class/Interface Relationships
REPL: main component, manages overall state and interactions between components

REPLInput: allows users to input commmands, updates command history and displays command outputs while working directly with REPL component

REPLHistory: recieves history array as props, displays history of entered commands by the user and their outputs

ControlledInput: used by REPLInput to capture user commands

LoginButton: user authentication, button for users to login/logout

App: integrates user authentication and REPL component rendering based on login status

# Errors/Bugs

Known bug: inputting extra spaces in between search command and search parameters prevents user from searching

# Tests

The program tests using both end to end and unit tests. The end to end tests test that the UI performs as expected when the user does varying actions, incl. entering commands and pressing login. The unit tests test specific functions in our program, mainly those located in the REPLInput class.

# How to

To run the program, run npm start in the terminal and follow the provided link. Users must click the login button to begin entering commands.

Run commands in the input box:

- mode: enter mode
- load_file: enter load_file followed by a space and the file to be loaded. ex: load_file file1
- view: enter view after loading a file
- search: enter search followed by either a search val and identifier, or simply a search val. ensure that a file is loaded before doing so. ex. w identifier: search col3 6  
  ex. w/o identifier: search ooo

Run tests: enter npm run test in terminal

# Collaboration

N/A