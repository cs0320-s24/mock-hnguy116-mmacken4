import { expect, test } from "@playwright/test";

/**
  The general shapes of tests in Playwright Test are:
    1. Navigate to a URL
    2. Interact with the page
    3. Assert something about the page against your expectations
  Look for this pattern in the tests below!
 */

// If you needed to do something before every test case...
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8000/");
});

test("on page load, i see a login button", async ({ page }) => {
  await expect(page.getByLabel("Login")).toBeVisible();
});

test("on page load, i dont see the input box until login", async ({ page }) => {
  await expect(page.getByLabel("Sign Out")).not.toBeVisible();
  await expect(page.getByLabel("Command input")).not.toBeVisible();

  // click the login button
  await page.getByLabel("Login").click();
  await expect(page.getByLabel("Sign Out")).toBeVisible();
  await expect(page.getByLabel("Command input")).toBeVisible();
});

test("on log out, i dont see the input box", async ({ page }) => {
  await expect(page.getByLabel("Sign Out")).not.toBeVisible();
  await expect(page.getByLabel("Command input")).not.toBeVisible();

  // click the login button
  await page.getByLabel("Login").click();
  await expect(page.getByLabel("Sign Out")).toBeVisible();
  await expect(page.getByLabel("Command input")).toBeVisible();

  // click the sign out button
  await page.getByLabel("Sign out").click();
  await expect(page.getByLabel("Sign Out")).toBeHidden();
  await expect(page.getByLabel("Command input")).toBeHidden();
});

test("after I type into the input box, its text changes", async ({ page }) => {
  // Step 1: Navigate to a URL
  await page.getByLabel("Login").click();

  // Step 2: Interact with the page
  // Locate the element you are looking for
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("Awesome command");

  // Step 3: Assert something about the page
  // Assertions are done by using the expect() function
  const mock_input = `Awesome command`;
  await expect(page.getByLabel("Command input")).toHaveValue(mock_input);
});

test("on page load, i see a button", async ({ page }) => {
  await page.getByLabel("Login").click();
  await expect(page.getByLabel("Submit")).toBeVisible();
});

test("after I click the button, my command gets pushed", async ({ page }) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("hi");
  await page.getByLabel("Submit").click();
  await expect(page.getByText("Command not found!")).toBeVisible();
});

test("after I input text, the command line empties", async ({ page }) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("hi");
  await page.getByLabel("Submit").click();
  await expect(page.getByLabel("Command input")).toBeEmpty;
});

test("after I input load_file, repl-history has value", async ({ page }) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("hi");
  await page.getByLabel("Submit").click();
  await expect(page.getByLabel("repl-history")).toHaveValue;
});

test("after I input load_file and view, an html table is displayed", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file1");
  await page.getByLabel("Submit").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByLabel("Submit").click();
  await expect(page.getByLabel("html-table")).toHaveValue;
});

test("repl-history is empty when no commands have occurred", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("hi");
  await page.getByLabel("Submit").click();
  await expect(page.getByLabel("Command input")).toBeEmpty;
});

// test("load does not work when the user is not logged in", async ({ page }) => {
//   await expect(page.getByLabel("Command input")).not.toBeVisible();
//   await expect(page.getByLabel("Submit")).not.toBeVisible();
//   await expect(page.getByLabel("Command input").fill("test command")).toBeTimeout(1);
//   await page.getByLabel("Submit").click();
//   await expect(page.getByLabel("repl-history")).toBeEmpty();
// });

test("after load_file and view, an html table has the right vals", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file1");
  await page.getByLabel("Submit").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByLabel("Submit").click();
  const tableContent = await page.$eval(
    ".html-table",
    (table) => table.innerHTML
  );
  expect(tableContent).toContain("<td>col1</td>");
  expect(tableContent).toContain("<td>col2</td>");
  expect(tableContent).toContain("<td>col3</td>");
  expect(tableContent).toContain("<td>1</td>");
  expect(tableContent).toContain("<td>2</td>");
  expect(tableContent).toContain("<td>3</td>");
  expect(tableContent).toContain("<td>4</td>");
  expect(tableContent).toContain("<td>1</td>");
  expect(tableContent).toContain("<td>6</td>");
  expect(tableContent).toContain("<td>7</td>");
  expect(tableContent).toContain("<td>8</td>");
  expect(tableContent).toContain("<td>9</td>");
  expect(tableContent).toContain("<td>4</td>");
  expect(tableContent).toContain("<td>2</td>");
  expect(tableContent).toContain("<td>6</td>");
});

test("mode changes the output", async ({ page }) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByLabel("Submit").click();
  let output = await page.innerText(".repl-history");
  expect(output).toContain('Command: mode Output: Verbose mode!');
});

test("after load_file and search, an html table has the right rows being returned", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file1");
  await page.getByLabel("Submit").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search col3 6");
  await page.getByLabel("Submit").click();
  const tableContent = await page.$eval(
    ".html-table",
    (table) => table.innerHTML
  );
  expect(tableContent).toContain("<td>4</td>");
  expect(tableContent).toContain("<td>1</td>");
  expect(tableContent).toContain("<td>6</td>");
  expect(tableContent).toContain("<td>4</td>");
  expect(tableContent).toContain("<td>2</td>");
  expect(tableContent).toContain("<td>6</td>");
});

test("search, an html table with right rows returned in verbose mode", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByLabel("Submit").click();
  await page.getByLabel("Command input").fill("load_file file1");
  await page.getByLabel("Submit").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search col3 6");
  await page.getByLabel("Submit").click();

  const tableContent = await page.$eval('.html-table', (table) => table.innerHTML);
  expect(tableContent).toContain('4</td>');
  expect(tableContent).toContain('1</td>');
  expect(tableContent).toContain('6</td>');
  expect(tableContent).toContain('4</td>');
  expect(tableContent).toContain('2</td>');
  expect(tableContent).toContain('6</td>');

  let output = await page.innerText('.repl-history');
  expect(output).toContain('Command: search col3 6 ');
  
});
