document.addEventListener("DOMContentLoaded", function() {
   var input = "";
   var expNum = 0;

    var buttons = document.getElementsByClassName("el");

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", handleClick);
    }

    function handleClick() {
        var value = this.getAttribute("data-value");
        
        if (value === "clear") {
            clearInput();
        } else if (value === "=") {
            evaluate();
        } else {
            if(expNum === 0){
                clearInput();
            }
            expNum++;
            append(value);
        }
    }

    function clearInput() {
        input = ""; // Clear the input
        document.getElementById("screen").value = ""; // Clear the screen
    }

    function append(value) {
        input += value; // Append clicked value to input
        document.getElementById("screen").value = input; // Update the screen
    }

    function evaluate() {
        input = safeEval(input); // Evaluate expression
        document.getElementById("screen").value = input; // Show result
        expNum = 0;
          
    }

    function safeEval(expression) {
        // Using Function is not recommended; consider using a math library
        return Function('"use strict";return (' + expression + ')')();
    }

    document.addEventListener("keydown", function (event) {
        const validKeys = "0123456789+-*/=!"; // Allowed keys
        const key = event.key;
    
        if (key === "=")
            evaluate(); 
        else if (validKeys.includes(key))
            append(key); 
        else if(key === "Delete")
            clearInput();
        else
            console.error(`Unsupported key: ${key}`);
    });
    
});
