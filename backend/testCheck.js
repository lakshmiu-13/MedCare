

async function testCheck() {
  const response = await fetch("http://localhost:5000/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input: "Fever",
      age: 25,
      sex: "male",
      duration: 2
    })
  });

  const data = await response.json();
  console.log(data);
}

testCheck();
