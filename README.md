# Instructions

## Setup
1. change directory to this project
```
cd DH2321_Project
```
2. install the dependencies, NOTE: **DO NOT `npm audit fix` even there is `vulnerabilities`** 
```
npm install
```
3. open the dev mode
```
npm run dev
```

## Ways to add features
- If you are creating a page, 
    1. Create your page at the `src/pages`.
    2. Go to `src/App.jsx` and add your route to the code and import the corresponding page from `src/pages`.
- If you are creating a component,
    1. Create a folder for your components at `src/components`.
    2. Create your component in the folder you have created.

## Branch convention and Dev Process
**NEVER PUSH THE CHANGES DIRECTLY TO MAIN**

**After done with each part/feature**
1. Create a branch off main in the following format `<feature_nature>/<feature_name_or_fix>`
2. **Pull latest changes from main into branch before merging**
3. Push code only to your branch and create a PR to main once ready

## Features
**Feature Nature**
- frontend
- backend
- data
- design
