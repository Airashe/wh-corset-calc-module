import { corsetCollection } from './collection.js';

/**
 * DOM elements used for reading input values, and 
 * display output values of module.
 * 
 * @var {object}    inputWeight             Person's weight input DOM element.
 * @var {object}    inputHeight             Person's height input DOM element.
 * @var {object}    inputAge                Person's age input DOM element.
 * @var {object}    inputCorsetType         Corset type input DOM element.
 * @var {object}    inputCorsetHeightType   Corset height type input DOM element.
 * @var {object}    outputResultCost        Result const output DOM element.
 */
const documentModules = {
    inputWeight: undefined, 
    inputHeight: undefined, 
    inputAge: undefined, 
    inputCorsetType: undefined, 
    inputCorsetHeightType: undefined, 
    outputResultCost: undefined
};
/**
 * Module's params.
 * 
 * @var {bool}  intialized      Is module initilized successfully.
 */
const moduleParams = {
    initialized: true
};

/**
 * Module's values that are using for calculations.
 * 
 * @var {float}     inputWeight                 Person's weight.
 * @var {float}     inputHeight                 Person's height.
 * @var {int}       inputAge                    Person's age.
 * @var {int}       inputCorsetType             Corset's type.
 * @var {int}       inputCorsetHeightType       Corset's height type.
 * @var {float}     outputResultCost            Calculation result.
 */
const values = {
    inputWeight: 0, 
    inputHeight: 0, 
    inputAge: 0, 
    inputCorsetType: 0, 
    inputCorsetHeightType: 0, 
    outputResultCost: 0
};

/**
 * Module initialization.
 * 
 * @return {void}
 */
export const InitializeModule = () => {
    documentModules.inputWeight = document.getElementById("wh-cost-calc-input-weight");
    documentModules.inputHeight = document.getElementById("wh-cost-calc-input-height");
    documentModules.inputAge = document.getElementById("wh-cost-calc-input-age");
    documentModules.inputCorsetType = document.getElementById("wh-cost-calc-input-corset-type");
    documentModules.inputCorsetHeightType = document.getElementById("wh-cost-calc-input-corset-height-type");
    documentModules.outputResultCost = document.getElementById("wh-cost-calc-output-result");

    for(let domElement in documentModules)
        if(documentModules[domElement] === null) {
            console.error("WH-cost-calc module can not find " + domElement);
            moduleParams.initialized = false;
            break;
        } else {
            documentModules[domElement].onchange = (event) => { OnInputChange(event, domElement); };
            values[domElement] = DOMValueToModuleValue(documentModules[domElement].value);
        }

    if(moduleParams.initialized)
        Calculate();
};

/**
 * Action that calls whenever input values changed.
 * 
 * @param {object} event 
 */
const OnInputChange = (event, paramName) => {
    values[paramName] = DOMValueToModuleValue(event.target.value);
    console.log(values);
    Calculate();
}

/**
 * Change value from DOM variations to float.
 * 
 * If value is `NaN` returns **0**.
 * @param {*} value 
 * 
 * @return {float}
 */
const DOMValueToModuleValue = (value) => {
    value = parseFloat(value, 10);
    if(Number.isNaN(value))
        value = 0;
    return value;
}

/**
 * Calculate result cost.
 */
const Calculate = () => {
    let newResult = 0;
    if(corsetCollection[values.inputCorsetType] !== undefined) {
        let corsetData = corsetCollection[values.inputCorsetType];
        newResult = corsetData.initialCost;
        newResult += values.inputAge < 18 ? corsetData.ageModifier.child : corsetData.ageModifier.adult;
        
        let heightResult = corsetData.corsetHeightModifier[values.inputCorsetHeightType];
        if(values.inputAge < 18)
            heightResult /= 2;
        newResult += heightResult;

        let height = values.inputHeight > 5 ? values.inputHeight / 100 : values.inputHeight;
        let bmi = (values.inputWeight/(Math.pow(height, 2))).toFixed(2);
        if(bmi === "NaN" || bmi === "Infinity") {
            bmi = 0;
        }
        for(let key in corsetData.bmiModifiers) {

            let bottomValue = corsetData.bmiModifiers[key].borders.bottom !== undefined ? 
                                corsetData.bmiModifiers[key].borders.bottom : 0;
            let topValue = corsetData.bmiModifiers[key].borders.top !== undefined ? 
                            corsetData.bmiModifiers[key].borders.top : Infinity;
            let cost = corsetData.bmiModifiers[key].cost !== undefined ? 
                            corsetData.bmiModifiers[key].cost : 0;

            if(corsetData.bmiModifiers[key].extraCost !== undefined) {
                let extraUnits = bmi - bottomValue;
                cost += extraUnits*corsetData.bmiModifiers[key].extraCost;
                
            }

            if(bmi > bottomValue && bmi <= topValue) {
                newResult += cost;
                break;
            }
        }
    }
    values.outputResultCost = newResult;
    SetResult();
}

/**
 * Set result to DOM element.
 */
const SetResult = () => {
    documentModules.outputResultCost.innerHTML = values.outputResultCost;
};