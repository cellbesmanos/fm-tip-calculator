
function TipCalculator() {
  // all tip percentage buttons
  const percentOpt = document.querySelectorAll(".calc__option-list .calc__option");

  const customTip = document.querySelector(".calc__option-list .calc__custom-tip");
  const resetBtn = document.querySelector(".calc__result-controls .calc__reset-btn");

  // all user input fields except the custom tip
  // opted for objects since its better to read
  const inputFields = {
    "bill" : document.getElementById("bill-input"),
    "person" : document.getElementById("num-person-input")
  };

  // elements for displaying the output
  const outputBoxes = {
    "tipPerPerson" : document.getElementById("indiv-tip"),
    "totalPerPerson" : document.getElementById("indiv-bill")
  }

  this.initializeCalculator = function() {
    initializePercentBtn();
    setDefualtTipPercent();
    initializeInputFields();
    initializeResetBtn();
    isInputFieldsEmpty();  // disables the reset button if the fields were empty onload
    initializeCustomTipField();
  }

  const initializePercentBtn = function() {
    percentOpt.forEach(optClicked => {
      optClicked.addEventListener("click", () => {
        initializePercentBtnStates(optClicked);
        calculateTip(optClicked);
      });
    })
  }

  const initializePercentBtnStates = function(optClicked) {
    percentOpt.forEach(opt => {
      opt.classList.remove("calc__option--active");
    });

    optClicked.classList.add("calc__option--active");
  }

  // oly for the bill and person input, not the custom tip
  const initializeInputFields = function() {
    for(const field of Object.keys(inputFields)) {
      inputFields[field].addEventListener("input", () => {
        updateTip();
        isInputFieldsEmpty();
      })
    }

    initializeInputStates();
  }

  // oly for the bill and person input, not the custom tip
  const initializeInputStates = function() {
    for(const field of Object.keys(inputFields)) {
      let fieldContainer = inputFields[field].parentElement;

      // combining these two events emulates the focus pseudo class in CSS

      inputFields[field].addEventListener("focus", () => {
        fieldContainer.classList.add("calc__input--active");
      });

      inputFields[field].addEventListener("blur", () => {
        fieldContainer.classList.remove("calc__input--active");
      })
    }
  }

  const initializeCustomTipField = function() {
    customTip.addEventListener("input", () => {
      updateTip();
    })
  }

  const initializeResetBtn = function() {
    // if the reset btn is clicked set the totals to 0
    // and make the input fields empty

    resetBtn.addEventListener("click", () => {
      for(const box of Object.keys(outputBoxes)) {
        outputBoxes[box].innerHTML = "$0.00";
      }

      for(const field of Object.keys(inputFields)) {
        inputFields[field].value = "";
      }

      customTip.value = "";
    }) // end of reset button event listener
  }

  const setDefualtTipPercent = function() {
    const fifteenPercent = document.querySelector(".calc__option-list .calc__option:nth-child(3)");

    fifteenPercent.click();
  }

  const calculateTip = function(optClicked) {
    let tipPercent;
  
    const totalBill = parseFloat(inputFields["bill"].value);
    const personNum = parseFloat(inputFields["person"].value);

    // if any of the bill input is has fasly value or number of persons is 0
    // then don't calculate the tip
    if(!totalBill || personNum == 0) {
      return
    }

    isNumPeopleEmpty();

    // if personNum jas empty
    if(!personNum) {
      return
    }
  
    // if the custom tip field has input, use it to calculate the tip
  
    if(isCustomTipEmpty()) {
      tipPercent = parseFloat(customTip.value) / 100;
    } else {
      tipPercent = parseFloat(optClicked.innerHTML.slice(0, -1)) / 100;
    }
  
    const indivTip = (tipPercent * totalBill) / personNum;
    const personBill = (totalBill / personNum) + indivTip;

    outputBoxes["tipPerPerson"].innerHTML = `$${indivTip}`;
    outputBoxes["totalPerPerson"].innerHTML = `$${personBill}`;
  } // end of calculate tip function

  const updateTip = function() {
    // this ensures, whenever the user completely left the custom field blank,
    // that it will use the recently clicked tip option 
    const activeOpt = document.querySelector(".calc__option-list .calc__option--active");
      
    calculateTip(activeOpt);
  }

  const isCustomTipEmpty = function() {
    return customTip.value > 0;
  }

  const isInputFieldsEmpty = function() {
    // if any of the input fields, excluding the custom tip field, is empty
    // disable the reset button

    if(inputFields["bill"].value.length || inputFields["person"].value.length || inputFields["person"].value == 0) {
      resetBtn.disabled = true;
      resetBtn.classList.add("calc__reset-btn--disabled");
      return
    }
    resetBtn.disabled = false;
    resetBtn.classList.remove("calc__reset-btn--disabled");
  }

  const isNumPeopleEmpty = function() {
    const personFieldContainer = inputFields["person"].parentElement;

    const personInputGroup = personFieldContainer.parentElement;
    const errMsg = personInputGroup.querySelector(".calc__input-msg");
  
    // check if person input is empty or has 0 value
  
    if(!inputFields["person"].value.length > 0 || parseFloat(inputFields["person"].value) == 0) {
      errMsg.classList.add("calc__input-msg--active");
      personFieldContainer.classList.add("calc__input--error");
  
      return
    } 
    errMsg.classList.remove("calc__input-msg--active");
    personFieldContainer.classList.remove("calc__input--error");
  }
} // end of TipCalculator constructor function

const tipCalc = new TipCalculator();

// when the browser finished rendering all HTML elements and their styles

document.addEventListener("DOMContentLoaded", () => {
  tipCalc.initializeCalculator();
});
