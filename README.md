# Welcome to 2021 & our Exercise 5 homework README 

![YayyyYYYyYyyyy](https://octodex.github.com/images/baracktocat.jpg)

## Review for no-js-pls
<table>
<tr>
<td>
Link to review: https://github.com/Systems-Development-and-Frameworks/no-js-pls/pull/7#discussion_r552005187
</td>
</tr>
</table>


## TEAM 
Dirty_thirties is the homework team consisting of
```
Jenny | Nele | Sarah 
```
This README is created to share and publish our homework for Systems Development & Frameworks.


## Exercise #5

| Deadline                   | Date                   |
| -------------------------- | ---------------------- |
| Review due date (optional) | 16.12.2020 - 14:00     |
| Final Due date.            | 06.01.2021 - 14:00     |
| Extended                   | **10.01.2021**         |


## Objectives

:star: For choosing a scenario and writing installation instructions in `README.md`.

:star: For explaining *WHY* you have chosen the scenario in the `README.md`.

:star: For not committing sensitive secrets (e.g. API keys) unencrypted to the
repository.

:star: :star: Data created in mutations are persisted and your queries
and mutations still work as expected.

:star: :star: Your software tests are free of side effects.

:star: Your database is never left in an invalid state.

:star: You deny the client to call mutations and queries of your subschema
directly.

:star: For requesting a review and reviewing another team's PR.

All objectives must be implemented according to the [instructions](#instructions).

## choosing of a scenario
*--->>> Remote GraphQL API*

#### Why ?
We choosed the architecture of the Remote GraphQL API.
There are some reasons for this decision:
- we didn´t want to choose a local Neo4J DB architecture because of the accessibility and workability for all team members
- we thought a local DB could bring some problems with deferred processing of the task by different team members
- With remote GraphQL API´s we have more experiences 
- Remote GraphQL API architecture has some advantages:
  - Increase in performance: the number of requests required and the amount of data transferred can be reduced. This is a great advantage for the mobile sector.
  - The client can request several resources at the same time and receives all the necessary data with just one request.
  - There is only one end point. The client decides which data is required and only receives this.
  - remote availability instead of local architecture
- and to be honest: it was introduced to be the easier option 

Eventhough Neo4J has many advantages aswell, just one of our 3 team members has experiences with Neo4J. So we decided democratically against the local Neo4J DB for the Remote GraphQL API archticture.

## Installation instructions

To install the dependencies via npm:
```
$ npm install
```
Run Linter
```
$ npm run lint
```
Test Linter
```
$ npm run test
```
Run Backend
```
$ npm run dev
```

### Steps

- Create an account on [GraphCMS](https://graphcms.com/)
- Create a `Post` Model and add the the fields
  - Add a Field of Type `Single Line Text`
    - Add `Title` as Display Name
    - Check `Use as Title field`
    - Make the filed `Required`
  - Add a Field of Type `Refernce`: 
     - Reference to Person Model (Will be added laters)
  - Add a Field of Type `Refernce`:
    -  Reference to Vote Model (Will be added laters)
- Create a `Person` Model and add the fields 
  - Add a Field of Type `Single Line Text`
     - Add `Name` as Display Name
     - Check `Use as Title field`
     - Make the filed `Required`
  - Add a Field of Type `Single Line Text`
     - Add `Email` as Display Name
     - Check `Use as Title field`
     - Make the filed `Required`
     - Set field as `unique`
     - Check `Match a specific pattern` and choose Email whith Flag `Case insensitive`
  - Add a Field of Type `Single Line Text`
    - Add `Password` as Display Name
    - Make the filed `Required`
  - Add a Field of Type `Refernce`:
    - Reference to Vote Model Person Model (Will be added laters)
  - Create a `Vote` Model and add the fields 
  - Add a Field of Type `Number`
     - Add `Value` as Display Name
     - Make the filed `Required`
     - Limit input Range between -1 and 1
  - Add a Field of Type `Refernce`:
    - Reference to `Person` Model
    - Configure the Relation cardinality between `Votes`and `Person` to `Many-to-one`  ( Check: Allow multiple `Votes` per `Person`)
    - Set the display name in the `Configure refrence` Tab to `Voted by` 
    - Set the display name in the `Configure reverse filed` Tab to `Votes` 
    - NOTE: The inverse relationship will be atted to the `Person` Model automatically
  - Add a Field of Type `Refernce`:
    - Reference to `Post` Model
    - Configure the Relation cardinality between `Votes`and `Post` to `Many-to-one`  ( Check: Allow multiple `Votes` per `Post`)
    - Set the display name in the `Configure refrence` Tab to `Post` 
    - Set the display name in the `Configure reverse filed` Tab to `Votes` 
    - NOTE: The inverse relationship will be atted to the `Person` Model automatically
    

... YAYYYY almost done ... :stuck_out_tongue_closed_eyes:
![YayyyYYYyYyyyy](https://media4.giphy.com/media/fsQbx1hX7hPBBpIM5b/giphy.gif)

