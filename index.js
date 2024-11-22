document.addEventListener("DOMContentLoaded", function () {
    let input = ""; 
    let expNum = 0;
    let open = 0; 

    const buttons = document.getElementsByClassName("el");

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", handleClick);
    }

    function handleClick() {
        const value = this.getAttribute("data-value");

        if (value === "clear") 
            clearInput()
        else if (value === "=") 
            evaluate()
        else {
            if (expNum === 0) clearInput(); 
            expNum++;
            append(value);
        }
    }

    function clearInput() {
        input = "";
        document.getElementById("screen").value = "";
        expNum = 0;
        open = 0;
    }

    function append(value) {
        if (value === "sin" || value === "cos" || value === "tan") {
            input += `${value}(`; 
            open++; 
        } else if (value === "(") {
            input += value;
            open++;
        } else if (value === ")") {
            if (open > 0) 
                open--; 
            else {
                alert("Missing opening bracket");
                return;
            }
            input += value;
        } else {
            input += value; 
        }

        document.getElementById("screen").value = input;
    }

    function evaluate() {
        if (open > 0) {
            alert("Missing closing brackets!");
            return;
        }

        
        const tweakedInput = input
        .replace(/sin/, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan");

        const result = Function('"use strict"; return (' + tweakedInput + ')')();
        input = result.toString(); 
        document.getElementById("screen").value = input;
        expNum = 0; 
    
    }

    document.addEventListener("keydown", function (event) {
        const validKeys = "0123456789+-*/.()";
        const key = event.key;

        if (key === "=") 
            evaluate();
        else if (validKeys.includes(key)) 
            append(key);
        else if (key === "Delete") clearInput();
        else if (key === "Backspace") {
            input = input.slice(0, -1); 
            document.getElementById("screen").value = input;
        } else if (key === "Shift") {}
        else {
            alert(`Unsupported key: ${key}`);
        }
    });
});
