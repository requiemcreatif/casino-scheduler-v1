Introduction
In this task, you will be required to implement a scheduling system for game presenters' rotation on casino tables. An API will be allowing you to perform CRUD operations on two main resources:
Game Presenters
Tables
The game presenters resource represents the list of all game presenters employed by the company. Game Presenters will be split equally to fill in all three shifts within a 24 hour period (morning, afternoon, night), such that a single shift is 8 hours long.
During their shift, game presenters are required to rotate between a number of casino tables and break slots, such that every casino table must have a game presenter at any point in time. A minimum of 1 break slot is to be assigned to a game presenter within an entire shift.
The time taken by a game presenter on a casino table, or within a break slot must always be 20 minutes. The following table illustrates an example, showing part of the morning shift schedule for 4 game presenters over a group of 3 tables:

```
    07:00 - 07:20  07:20 - 07:40  07:40 - 08:00  08:00 - 08:20
GP 1    Table 1         Table 2         Table 3     Break
GP 2    Table 2         Table 3         Break       Table 1
GP 3    Table 3         Break           Table 1     Table 2
GP 4    Break           Table 1         Table 2     Table 3
```

The rotation of game presenters depends on the headcount per shift. The ideal number of game presenters per rotation is the number of tables + 1. If there are extra game presenters than the ideal number, then extra break slots would be given.
The rotation of game presenters depends on the headcount per shift. The ideal number of game presenters per rotation is the number of tables + 1. If there are extra game presenters than the ideal number, then extra break slots would be given.

Task
You are required to implement an application using React Framework that implements the following:
List, create, view, edit and delete game presenters
List, create, view, edit and delete tables
Use proper validation techniques when creating and editing data

Mock the backend API and set up mock data accordingly
Navigate between screens
Compute the rotation schedule of game presenters for a single day (3 shifts) and display it on screen using components of your choice.

Additional Challenges
You can boost your solution by implementing the following optional challenges:
Typescript
Write your code using typescript.
Security
Implement a login screen such that only authenticated users can make use of the application. In addition, implement permission-based access for certain screens, components and/or actions.
Configurable List View
Allow users to switch between 2 visualization techniques in order to list the game presenters on screen.
Loading Component
Display some sort of loading/skeleton components when loading data.
Docker
Create a Dockerfile (and an optional docker compose file) and provide instructions on how to build and run the application.

Deliverables
You are expected to deliver the following:
A working solution for the above requirements
Unit tests for the implemented solution
Proper documentation in a README file outlining any pre-requisites required, how to build and run the application, an explanation to your design and solution, and possible limitations and improvements within you’re application.
Everything must be committed to a git repository.
