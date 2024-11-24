document.addEventListener("DOMContentLoaded", function () {
    let input = "", secInput = "", exp = "", root = "", base = "",num="", fact = false, equation = "", solving = false;;
    let symNum = 0;
    let open = 0; 

    const buttons = document.getElementsByClassName("el");

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", handleClick);
    }

    function handleClick() {
        const value = this.getAttribute("data-value");

        if (value === "clear") 
            clearInput();
        else if (value === "=") 
            solving ? solveEquation() : evaluate();
        else if (value === "solve")
            toggleSolveMode();
        else {
            if (symNum === 0 && !solving) clearInput();
            symNum++;
            append(value);
        }
    }

    function clearInput() {
        input = "";
        secInput = "";
        equation = "";
        solving = false;
        document.getElementById("screen").value = "";
        symNum = 0;
        open = 0;
    }

    function append(value) {

        if (solving) {
            equation += value;
            document.getElementById("screen").value = equation;
            return;
        }

        if (value === "exp") {
            input += "exp(";
            secInput += "Math.exp(";
            open++
        }else if (value === "sin" || value === "cos" || value === "tan") {
            input += `${value}(`;
            secInput += `${input !== "" ? "*" : ""}Math.${value}(`;
            open++;
        } else if (value === "(") {
            input += value;
            secInput += value;
            open++;
        } else if (value === ")") {
            if (open > 0) {
                if (exp && exp !== "nada") {
                    secInput = `Math.pow(${secInput.replace(exp, "")}, ${exp})`;
                    exp = "";
                } else if (root && root !== "nada") {
                    secInput = `Math.pow(${secInput.replace(root, "")}, 1/${root})`;
                    root = "";
                } else if (num && num !== "nada") {
                    secInput = `Math.log(${num})/Math.log(${base})`;
                    num = "";
                    base = "";
                } else if (base && base !== "nada") {
                    num = "nada";
                } else {
                    secInput += value;
                }
                open--;
            } else {
                alert("Missing opening bracket");
                return;
            }
    
            if (base && base !== "nada") {
                input += ")(";
                open++;
            } else {
                input += value;
            }
        } else if (value === "x^2") {
            if (input === "") {
                alert("Exponent without base");
                clearInput();
            }
            secInput = `Math.pow(${secInput}, 2)`;
            input += "^2";
        } else if (value === "x^y") {
            if (input === "") {
                alert("Exponent without base");
                clearInput();
            }
            exp = "nada";
            input += "^(";
            open++;
        } else if (value === "π") {
            const constantValue = "Math.PI";
            input += value;
            if (base === "nada") base = constantValue;
            else if (exp === "nada") exp = constantValue;
            else if (num === "nada") num = constantValue;
            else secInput += (input !== "" ? "*" : "") + constantValue;
        } else if (value === "e") {
            const constantValue = "Math.E";
            input += value;
            if (base === "nada") base = constantValue;
            else if (exp === "nada") exp = constantValue;
            else if (num === "nada") num = constantValue;
            else secInput += (input !== "" ? "*" : "") + constantValue;

        } else if(value ==="ln"){
            input += "ln(";
            base = "Math.E";
            num = "nada";
            open++;
        }else if (value === "√") {
            input += value + "(";
            secInput += "Math.sqrt(";
            open++;
        } else if (value === "x√") {
            root = secInput;
            input += "√(";
            open++;
        } else if (value === "log") {
            input += "log_(";
            base = "nada";
            open++;
        }else if(value === "x!"){
            input += "!";
            fact = true;

        } else if (exp) {
            if (exp === "nada") 
                exp = "";
            exp += value;
            input += value;
            secInput += value;

        } else if (num) {
            if (num === "nada") 
                num = "";
            num += value;
            input += value;

        } else if (base) {
            if (base === "nada") 
                base = "";
            base += value;
            input += value;
        } else {
            input += value;
            secInput += value;
        }
    
        document.getElementById("screen").value = input;
    }    

    // function toggleSolveMode() {
    //     solving = true;
    //     equation = "";
    //     document.getElementById("screen").value = "Enter equation...";
    // }

    // function solveEquation() {
    //     try {
    //         const [lhs, rhs] = equation.split("=").map(side => side.trim());
    //         if (!lhs || !rhs) throw new Error("Invalid equation format");

    //         // Assume `x` as the variable to solve for
    //         const solveForX = Function(
    //             `"use strict"; return (x) => (${lhs}) - (${rhs});`
    //         )();
    //         const solution = binarySearchSolution(solveForX);
    //         document.getElementById("screen").value = `x ≈ ${solution.toFixed(5)}`;
    //         solving = false;
    //     } catch (error) {
    //         alert("Error solving equation: " + error.message);
    //     }
    // }

    // function binarySearchSolution(func, tol = 1e-6) {
    //     let low = -1e6, high = 1e6;
    //     while (high - low > tol) {
    //         const mid = (low + high) / 2;
    //         const result = func(mid);
    //         if (Math.abs(result) < tol) return mid;
    //         if (result > 0) high = mid;
    //         else low = mid;
    //     }
    //     return (low + high) / 2;
    // }

    function factorial(n) {
        if (n < 0) {
            throw new Error("Factorial is not defined for negative numbers");
        }
        if (n === 0 || n === 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }

    function evaluate() {
        if (open > 0) {
            alert("Missing closing brackets!");
            return;
        }

        if(fact)
        {
            document.getElementById("screen").value = factorial(secInput).toString();
            symNum = 0; 
            return;
        }

        const tweakedInput = secInput
        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")
        .replace(/√/g, "Math.sqrt")
        
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
