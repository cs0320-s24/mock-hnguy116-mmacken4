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
//   await expect(page.getByLabel("Sign Out")).toBeHidden();
//   await expect(page.getByLabel("Command input")).toBeHidden();
//   await expect(() =>
//     page.getByLabel("Command input").fill("hi", { timeout: 1000 })
//   ).toThrowError(TimeoutError);
//   await page.click("Submit");
//   await expect(page.getByLabel("repl-history")).toBeNull();
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
  expect(output).toContain("Command: mode Output: Verbose mode!");
});

test("test mode for both brief and verbose", async ({ page }) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByLabel("Submit").click();
  let output = await page.innerText(".repl-history");
  expect(output).toContain("Verbose mode!");
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByLabel("Submit").click();
  output = await page.innerText(".repl-history");
  expect(output).toContain("Brief mode!");
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

test("search - an html table with right rows returned in verbose mode", async ({
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

  const tableContent = await page.$eval(
    ".html-table",
    (table) => table.innerHTML
  );
  expect(tableContent).toContain("4</td>");
  expect(tableContent).toContain("1</td>");
  expect(tableContent).toContain("6</td>");
  expect(tableContent).toContain("4</td>");
  expect(tableContent).toContain("2</td>");
  expect(tableContent).toContain("6</td>");

  let output = await page.innerText(".repl-history");
  expect(output).toContain("Command: search col3 6 ");
});

test("when searching an empty file, File is empty! is displayed", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file mtfile");
  await page.getByLabel("Submit").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search col3 6");
  await page.getByLabel("Submit").click();
  await expect(page.getByText("File is empty!")).toBeVisible();
});

test("when loading a non-existing file, File not found! is displayed", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file beep");
  await page.getByLabel("Submit").click();
  await expect(page.getByText("File not found!")).toBeVisible();
});

test("when viewing without loading a file, File not found! is displayed", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByLabel("Submit").click();
  await expect(page.getByText("File not found!")).toBeVisible();
});

test("when searching without loading a file, File not found! is displayed", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search col3 6");
  await page.getByLabel("Submit").click();
  await expect(page.getByText("File not found!")).toBeVisible();
});

test("when searching with too many parameters, the right message is displayed", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file1");
  await page.getByLabel("Submit").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search col3 beep beep");
  await page.getByLabel("Submit").click();
  await expect(
    page.getByText("Too many parameters given, unable to search file.")
  ).toBeVisible();
});

test("when searching for a non-existent value, Value dne is displayed", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file1");
  await page.getByLabel("Submit").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search 0 hi");
  await page.getByLabel("Submit").click();
  await expect(page.getByText("Value does not exist in file")).toBeVisible();
});

test("when searching for a non-existent index, Non-existent index! is displayed", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file4");
  await page.getByLabel("Submit").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search 6000 RI");
  await page.getByLabel("Submit").click();
  await expect(page.getByText("Non-existent index!")).toBeVisible();
});

test("when searching a dataset with one row, the right value is displayed", async ({
  page,
}) => {
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file5");
  await page.getByLabel("Submit").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search boo");
  await page.getByLabel("Submit").click();

  const tableContent = await page.$eval(
    ".html-table",
    (table) => table.innerHTML
  );

  expect(tableContent).toContain("<td>boo</td>");
});

test("search across multiple files with correct results in html table", async ({
  page,
}) => {
  //File not loaded search
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search col3 6");
  await page.getByLabel("Submit").click();
  await expect(page.getByText("File not found!")).toBeVisible();

  // Load file1 and perform a search
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByLabel("Submit").click();
  await page.getByLabel("Command input").fill("load_file file1");
  await page.getByLabel("Submit").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search col3 6");
  await page.getByLabel("Submit").click();

  const tableData = await page.locator(".html-table").first().innerHTML();
  expect(tableData).toContain("4</td>");
  expect(tableData).toContain("1</td>");
  expect(tableData).toContain("6</td>");
  expect(tableData).toContain("4</td>");
  expect(tableData).toContain("2</td>");
  expect(tableData).toContain("6</td>");

  // Load file2 and perform a search
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file2");
  await page.getByLabel("Submit").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search ooo");
  await page.getByLabel("Submit").click();
  const tableData2 = await page.locator(".html-table").nth(1).innerHTML();

  expect(tableData2).toContain("<td>ooo</td>");
  expect(tableData2).toContain("<td>cee</td>");
  expect(tableData2).toContain("<td>see</td>");
  expect(tableData2).toContain("<td>beep</td>");
  expect(tableData2).toContain("<td>ooo</td>");
  expect(tableData2).toContain("<td>bloo</td>");
});

test("search across one file with correct results in html table", async ({
  page,
}) => {
  // Load file1 and perform a search
  await page.getByLabel("Login").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("mode");
  await page.getByLabel("Submit").click();
  await page.getByLabel("Command input").fill("load_file file1");
  await page.getByLabel("Submit").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search col3 6");
  await page.getByLabel("Submit").click();

  const tableData = await page.locator(".html-table").first().innerHTML();
  expect(tableData).toContain("4</td>");
  expect(tableData).toContain("1</td>");
  expect(tableData).toContain("6</td>");
  expect(tableData).toContain("4</td>");
  expect(tableData).toContain("2</td>");
  expect(tableData).toContain("6</td>");

  // perform a 2nd search on same file
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file1");
  await page.getByLabel("Submit").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search 0 1");
  await page.getByLabel("Submit").click();

  const tableData2 = await page.locator(".html-table").nth(1).innerHTML();

  expect(tableData2).toContain("<td>1</td>");
  expect(tableData2).toContain("<td>2</td>");
  expect(tableData2).toContain("<td>3</td>");
});

test("search a file then load and view a different one", async ({ page }) => {
  // Load file2 and perform a search
  await page.getByLabel("Login").click();

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file2");
  await page.getByLabel("Submit").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("search ooo");
  await page.getByLabel("Submit").click();
  const tableData = await page.locator(".html-table").nth(0).innerHTML();

  expect(tableData).toContain("<td>ooo</td>");
  expect(tableData).toContain("<td>cee</td>");
  expect(tableData).toContain("<td>see</td>");
  expect(tableData).toContain("<td>beep</td>");
  expect(tableData).toContain("<td>ooo</td>");
  expect(tableData).toContain("<td>bloo</td>");

  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("load_file file1");
  await page.getByLabel("Submit").click();
  await page.getByLabel("Command input").click();
  await page.getByLabel("Command input").fill("view");
  await page.getByLabel("Submit").click();
  const tableData2 = await page.locator(".html-table").nth(1).innerHTML();
  expect(tableData2).toContain("<td>col1</td>");
  expect(tableData2).toContain("<td>col2</td>");
  expect(tableData2).toContain("<td>col3</td>");
  expect(tableData2).toContain("<td>1</td>");
  expect(tableData2).toContain("<td>2</td>");
  expect(tableData2).toContain("<td>3</td>");
  expect(tableData2).toContain("<td>4</td>");
  expect(tableData2).toContain("<td>1</td>");
  expect(tableData2).toContain("<td>6</td>");
  expect(tableData2).toContain("<td>7</td>");
  expect(tableData2).toContain("<td>8</td>");
  expect(tableData2).toContain("<td>9</td>");
  expect(tableData2).toContain("<td>4</td>");
  expect(tableData2).toContain("<td>2</td>");
  expect(tableData2).toContain("<td>6</td>");
});
