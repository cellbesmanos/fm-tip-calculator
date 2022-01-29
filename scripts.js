
// add event listeners to tip percent buttons
// take their percentage
// each click will take the bill, no. of person, and update the tip
// disable reset if inputs were empty

function initializeCalcControls () {
  const calcOpt = document.querySelectorAll(".calc__option-list .calc__option");
  const billInput = document.getElementById("bill-input");
  const personInput = document.getElementById("num-person-input");
  const inputFields = [billInput, personInput];
  const customTip = document.querySelector(".calc__option-list .calc__custom-tip");
  
  const indivOutputBox = document.getElementById("individual-tip");
  const totalOutputBox = document.getElementById("total-tip");
  const outputBoxes = [indivOutputBox, totalOutputBox];

  const resetResult = document.querySelector(".calc__result-controls .calc__result-reset");

  calcOpt.forEach(optClicked => {
    optClicked.addEventListener("click", () => {
      initializeTipStates(calcOpt, optClicked);
      calculateTip(inputFields, outputBoxes, optClicked, customTip);
    });
  }); // end of calcOpt for each
  
  initializeDefualtTip();
  initializeInputStates(inputFields);
  initializeResetButton(outputBoxes, inputFields, customTip, resetResult);
  checkInputFields(inputFields, resetResult);

  inputFields.forEach(field => {
    field.addEventListener("input", () => {
      updateTip(inputFields, outputBoxes, customTip);
      checkInputFields(inputFields, resetResult);
    });
  }) // end of input fields for each

  customTip.addEventListener("input", () => {
    updateTip(inputFields, outputBoxes, customTip);
  })

}

// INDIVIDUAL FUNCTIONS STARTS HERE

function initializeInputStates(fields) {
  fields.forEach(field => {
    
    const fieldContainer = field.parentElement;

    field.addEventListener("focus", () => {
      fieldContainer.classList.add("calc__input--active");
    })

    field.addEventListener("blur", () => {
      fieldContainer.classList.remove("calc__input--active");
    })
  })
}

function initializeTipStates(optArray, optClicked) {
  optArray.forEach(opt => {
    opt.classList.remove("calc__option--active");
  })

  optClicked.classList.add("calc__option--active");
}

function initializeDefualtTip() {
  const fifteenPercent = document.querySelector(".calc__option-list .calc__option:nth-child(3)");

  fifteenPercent.click();
}

function initializeResetButton(boxes, fields, cust, resetBtn) {
  resetBtn.addEventListener("click", () => {
    boxes[0].innerHTML = "$0.00";
    boxes[1].innerHTML = "$0.00";

    fields.forEach(field => {
      field.value = '';
    })

    cust.value = '';
  })
}

function calculateTip(fields, boxes, opt, cust) {
  let tipPercent;

  const totalBill = parseFloat(fields[0].value);
  const personNum = parseFloat(fields[1].value);

  // if any of the input fields were empty don't calculate

  if(!totalBill || personNum == 0) {
    return
  }

  checkNumOfPeople(fields[1]);

  // if personNum is empty
  if(!personNum) {
    return
  }

  // if the custom tip field has input, prioritize it

  if(checkCustomTip(cust)) {
    tipPercent = parseFloat(cust.value) / 100;
  } else {
    tipPercent = parseFloat(opt.innerHTML.slice(0, -1)) / 100;
  }

  const totalTip = tipPercent * totalBill;
  const indivTip = totalTip / personNum;

  boxes[0].innerHTML = `$${indivTip}`;
  boxes[1].innerHTML = `$${totalTip}`;
}

function checkCustomTip(cust) {
  return cust.value.length > 0;
}

function updateTip(inputFields, outputBoxes, customTip) {
  // this ensures, whenever the user completely left the custom field
  // blank, that it will the recently clicked tip option 
  const activeOpt = document.querySelector(".calc__option-list .calc__option--active");
    
  calculateTip(inputFields, outputBoxes, activeOpt, customTip);
}

function checkInputFields(fields, resetBtn) {
  if((fields[0].value.length <= 0 || fields[1].value.length <= 0) || fields[1].value == 0) {
    resetBtn.disabled = true;
    resetBtn.classList.add("calc__result-reset--disabled");
    return
  } 
  resetBtn.disabled = false;
  resetBtn.classList.remove("calc__result-reset--disabled");
}

function checkNumOfPeople(field) {
  const fieldContainer = field.parentElement;

  const inputGroup = fieldContainer.parentElement;
  const errMsg = inputGroup.querySelector(".calc__input-msg");

  // check if person input is empty or has 0 value

  if(!field.value.length > 0 || parseFloat(field.value) == 0) {
    errMsg.classList.add("calc__input-msg--active");
    fieldContainer.classList.add("calc__input--error");

    return
  } 
  errMsg.classList.remove("calc__input-msg--active");
  fieldContainer.classList.remove("calc__input--error");
}

document.addEventListener("DOMContentLoaded", () => {
  initializeCalcControls();
})