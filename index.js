document.addEventListener("DOMContentLoaded", function () {
    let input = "", secInput = "", exp = "", root = "";
    let symNum = 0;
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
            if (symNum === 0) clearInput(); 
            symNum++;
            append(value);
        }
    }

    function clearInput() {
        input = ""
        secInput = ""
        document.getElementById("screen").value = "";
        symNum = 0;
        open = 0;
    }

    function append(value) {

        if (value === "sin" || value === "cos" || value === "tan") {
            input += `${value}(`; 
            if(input != "")
                secInput += `*${value}(`;
            else
                secInput += `${value}(`;
            open++; 
            
        } else if (value === "(") {
            input += value;
            secInput += value;
            open++;

        } else if (value === ")") {

            console.log(secInput)
            console.log(root)

            if (open > 0) {
                if (exp != "nada") {
                    secInput = `Math.pow(${secInput.replace(exp,"")}, ${exp})`;
                    exp = ""; 
                } else if(root != "nada"){
                    const base = parseFloat(root)
                    base = 1/base
                    secInput = `Math.pow(1*(${secInput.replace(root,"")}), ${base.toString()})`;
                    root = ""; 
                }else {
                    secInput += value;  
                }
                open--; 
            } else {
                alert("Missing opening bracket");
                return;
            }

            console.log(input)
            console.log(secInput)
            input += value;

        } else if(value === "x^2"){
            if(input === ""){
                alert("Exponent without base")
                clearInput()
            }
            secInput = `Math.pow(${secInput}, 2)`;
            input += "^2"

        } else if(value === "x^y"){
            if(input === ""){
                alert("Exponent without base")
                clearInput()
            }
            exp = "nada"
            input += "^("
            open++;

        } else if(value === "π"){

            if(input != "")
                secInput += "*Math.PI";
            else
                secInput += "Math.PI";

            input += value; 

        } else if(value === "e"){
            if(input != "")
                secInput += "*Math.E";
            else
                secInput += "Math.E";

            input += value; 

        }else if(value === "√"){
            input += value + "("; 
            secInput += value + "("; 
            open++;

        }else if(value === "x√"){
            root = secInput
            input += "√("
            open++;

        }else if(exp != ""){
            if(exp === "nada")
                exp = ""
            exp += value
            input += value; 
            secInput += value;

        // } else if(root != ""){
        //     if(root === "nada")
        //         root = ""
        //     root += value
        //     input += value; 
        //     secInput += value;
        } else {
            input += value; 
            secInput += value;
        }

        document.getElementById("screen").value = input;
    }

    function evaluate() {
        if (open > 0) {
            alert("Missing closing brackets!");
            return;
        }

        const tweakedInput = secInput
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/√/g, "Math.sqrt")
        // .replace(/l1/g, "1/")

        const result = Function('"use strict"; return (' + tweakedInput + ')')();
        secInput = result.toString(); 
        document.getElementById("screen").value = secInput;
        symNum = 0; 
    
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
