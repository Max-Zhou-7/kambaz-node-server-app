export default function AddingAndRemovingToFromArrays() {
   const numberArray1 = [1, 2, 3, 4, 5];
   const stringArray1 = ["string1", "string2"];
  
  // Add items (creates new arrays)
  const numberArray2 = [...numberArray1, 6];
  const stringArray2 = [...stringArray1, "string3"];
  
  // Remove items (creates new arrays)
  const numberArray3 = numberArray1.filter((_, index) => index !== 2);
  const stringArray3 = stringArray1.filter((_, index) => index !== 1);
  
  // Todo array with keys
  const todoArray = [
    <li key="1">Buy milk</li>, 
    <li key="2">Feed the pets</li>,
    <li key="3">Walk the dogs</li>
  ];

  return (
    <div id="wd-adding-removing-from-arrays">
      <h4>Add/remove to/from arrays</h4>
      
      <h5>Original Arrays:</h5>
      numberArray1 = {numberArray1.join(", ")} <br />
      stringArray1 = {stringArray1.join(", ")} <br />
      
      <h5>After Adding:</h5>
      numberArray2 = {numberArray2.join(", ")} <br />
      stringArray2 = {stringArray2.join(", ")} <br />
      
      <h5>After Removing:</h5>
      numberArray3 = {numberArray3.join(", ")} <br />
      stringArray3 = {stringArray3.join(", ")} <br />
      
      <h5>Todo list:</h5>
      <ol>{todoArray}</ol>
      <hr />
    </div>
  );
}