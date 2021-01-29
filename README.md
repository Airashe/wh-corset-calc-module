# Wild Hearts corset cost calculator.

## Setup

1. Add ids to `<input>` tags that are represents inputs for calculator. 
List of ids that module is using:
+ `wh-cost-calc-input-weight` for client's weight.
+ `wh-cost-calc-input-height` for client's height.
+ `wh-cost-calc-input-age` for client's age.
+ `wh-cost-calc-input-corset-type` for type of corset.
+ `wh-cost-calc-input-corset-height-type` for height type of corset.
+ `wh-cost-calc-output-result` for result output.

2. Add module index file to your HTML document: `<script type="module" src="./wh-corset-calc-module/index.js"></script>`.

## How to edit module's collection

To edit calculator's collection you need to open **collection.js**

    0: {
        initialCost: 23000, 
        ageModifier: {
            child: {
                borders: {
                    top: 18
                }, 
                cost: 2000
            }, 
            adult: {
                borders: {
                    bottom: 18
                }, 
                cost: 7000
            }
        }, 
        corsetHeights: {
            0: 0, 
            1: 10000
        }, 
        bmiModifiers: {
            under25: {
                borders: {
                    top: 25, 
                    bottom: 0
                }
            }, 
            between25and30: {
                borders: {
                    top: 30, 
                    bottom: 25
                }, 
                cost: 3000
            }, 
            after30: {
                borders: {
                    bottom: 30
                }, 
                cost: 3000, 
                extraCost: 500
            }
        }
    }

Any corset have it's own name represented as `Int`.

Every corset data have available list of parameters: 
+ `initialCost` - wich is basic cost for corset.
+ `ageModifier` - *modifier* that describes conditions needed for increasing cost based on age.
+ `corsetHeights` - types of available heights for this corset.
+ `bmiModifier` - *modifier* that describes conditions need for increasing cost based on BMI.

If any of this parameters will not be set than its value will equals to 0.

## How modifiers work

    modifier: {
                condition1: {
                    borders: {
                        top: 100
                    }, 
                    cost: 2000
                }, 
                condition2: {
                    borders: {
                        bottom: 18
                    }, 
                    cost: 7000, 
                    extraCost: 100
                }
            }

Modifier is list of conditions for increasing cost for corset. Any term have available list of parameters:

+ `borders`
+ `cost`
+ `extraCost`

### Borders

In process of calculation module will scan every condition and checks if input value is inside borders, and if it is then it will add `cost` parameter of condition to result cost.

Borders have top and bottom value. Default value for bottom is equals to 0 and default value for top is `Infinity`.

Module will stop checking conditions list on first time value stands between top and bottom border, so be very careful with that.

### Extra cost 

If `extraCost` is defined then module will add `extraCost*(value-borders.bottom)` to result. So basicly it's cost for each unit exceeding bottom border of condition.
