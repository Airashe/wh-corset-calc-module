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
        newResult = corsetData.initialCost !== undefined ? corsetData.initialCost : 0;

        if(corsetData.ageModifier !== undefined)
            newResult += CalculateModifierObject(corsetData.ageModifier, values.inputAge);
        
        if(corsetData.corsetHeights !== undefined && corsetData.corsetHeights[values.inputCorsetHeightType] !== undefined) {
            let heightResult = corsetData.corsetHeights[values.inputCorsetHeightType];
            if(values.inputAge < 18)
                heightResult /= 2;
            newResult += heightResult;
            heightResult = null;
        }

        if(corsetData.bmiModifier !== undefined) {
            let height = values.inputHeight > 5 ? values.inputHeight / 100 : values.inputHeight;
            let bmi = (values.inputWeight/(Math.pow(height, 2))).toFixed(2);
            if(bmi === "NaN" || bmi === "Infinity")
                bmi = 0;

            newResult += CalculateModifierObject(corsetData.bmiModifier, bmi);
        }
        
    }
    values.outputResultCost = newResult;
    SetResult();
}

/**
 * Reads modifier data and return additional 
 * cost defined by it's parameters.
 * 
 * @param {object}  modifier    Modifier's data.
 * @param {int}     value       Input value for this modifier. 
 * 
 * @return {int} Additional cost.
 */
const CalculateModifierObject = (modifier, value) => {
    let result = 0;

    for(let modifierKey in modifier) {

        let borderTop = Infinity;
        let borderBottom = 0;
        if(modifier[modifierKey].borders !== undefined) {
            borderBottom = modifier[modifierKey].borders.bottom !== undefined ? modifier[modifierKey].borders.bottom : 0;
            borderTop = modifier[modifierKey].borders.top !== undefined ? modifier[modifierKey].borders.top : Infinity;
        }
        let cost = modifier[modifierKey].cost !== undefined ? modifier[modifierKey].cost : 0;
        let extraCostPerUnit = modifier[modifierKey].extraCost !== undefined ? modifier[modifierKey].extraCost : 0;

        if(value >= borderBottom && value < borderTop) {
            result += cost;
            if(extraCostPerUnit !== 0)
                result += (value - borderBottom)*extraCostPerUnit;
            break;
        }
    }

    return Number.parseInt(result, 10);
};

/**
 * Set result to DOM element.
 */
const SetResult = () => {
    documentModules.outputResultCost.innerHTML = values.outputResultCost;
};