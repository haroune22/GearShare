// test-google.ts

const test = async () => {
  const response = await fetch("https://oauth2.googleapis.com/token");

  console.log(response.status);
  console.log(await response.text());
};

test();
