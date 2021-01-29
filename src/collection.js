/**
 * Corsets collection for calculation.
 * 
 * @var {object}
 */
export const corsetCollection = {
    /**
     * Monolit.
     */
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
    }, 
    /**
     * Turtle.
     */
    1: {
        initialCost: 25000, 
        ageModifier: {
            child: {
                borders: {
                    top: 18
                }, 
                cost: 5000
            }, 
            adult: {
                borders: {
                    bottom: 18
                }, 
                cost: 15000
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
                cost: 5000
            }, 
            after30: {
                borders: {
                    bottom: 30
                }, 
                cost: 5000, 
                extraCost: 1000
            }
        }
    }
};