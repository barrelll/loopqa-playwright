# Introduction
A Playwright-driven test suite that leverages data-driven techniques to minimize code duplication and improve scalability. By driving test scenarios from a JSON object, we can dynamically adapt each test case without repeating code, ensuring a clean and maintainable structure as new cases are added.

## How To Use
To add a test scenario, simply add a json file to the test_data folder in this format
```
{
    "test_case": "testing asana 1", #the name of the test.
    # the project plan page to navigate to
    "plan_page": "https://app.asana.com/0/1205367008165973/1205366758273574", 
    "task_name": "Draft project brief", # the title of the task
    "column_name": "To do", # the expected column the task is under
    "fields": [
        # fields to verify inside the task
        {"name": "Priority", "value": "Non-Priority"}, 
        {"name": "Status", "value": "On track"}
    ]
}
```
then
```
npx playwright test
```

# Challenges and Solutions
1. Problem: Too many authentications attempts in the first test runs.

     Solution: Saving the authentication state for all test runs. Currently this solution is using a single account for each test run as we don't modify any data, only verify the end UI. If that changes we could try using multiple saved auth states for each worker request. Ideally we'd log in using an API.

2. Finding unique and stable locators on this site while also minimalizing as much code duplication as possible was a challenge for a couple reasons. The first being that almost everything was customizable in the since it could share a name, be it a field or task. There were also very little unique identifiers or tagnames (After doing some digging I did find that tags have a unique ID to leverage //div[@data-task-id="some number"]). 

     Solution: My solution here was using relative locators and text for items I don't believe have a high likelyhood of changing for example 'Fields'.

3. Navigation to Specific Projects/Sections, If project names ("Cross-functional project plan, Project" or "Work Requests") change, tests will fail unless a consistent identifier (e.g., a project ID) is used. 
        
     Solution: Directly navigating to project pages.

# Recommendations for improvements
The current solution uses json files as input, this could potentially be sped up by using a MongoDB to feed the TC blobs. The DB could include an interface for creating test scenario's as well.

Using static paths like "../../../../div[2]" feels bad as the UI could always be updated by some change to the application I'd prefer a more sustainable aproach using xpaths/css selectors/ID's etc. Seperating these into TC's for projects as opposed to one would be helpful in that regard.

Not every project will default to the board, I should either come up with a seperate solution for each tab or double check that we are inside the board tab before executing the rest of the test case.

I'm currently only verifying that each item is under a column by getting the column element and checking to see if it's under the subtree. I should consider including checking if the corresponding data contains the correct column as well as checking it's relative location in the UI.

I went ahead and ran these with repeatEach = 50, this typically ended up with a few timeouts, 1-3. We might consider implementing retries and screenshots for failed tests to aid debugging