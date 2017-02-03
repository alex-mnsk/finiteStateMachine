class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
    	this.message = {
    		confError: 'config isn\'t passed', 
    		changeStateError: 'state isn\'t exist',
    		triggerError: 'event in current state isn\'t exist'
    	} ;
		this.config = config;
		this.activeState = this.config.initial;		
    	this.stateHistory = [this.config.initial];
    	this.historyIndex = 1;
    	this.redoAvailable = true;
    	
    	if (!config) {
    		 throw new Error(this.message.confError);
    	}    	
    }

    
    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
    	return this.activeState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
		if (!this.config.states[state]) {
			throw new Error(this.message.changeStateError);
		}
		for (var stt in this.config.states) {
    		if (stt == state) {
	    		this.activeState = state;
	    		this.stateHistory.push(this.activeState);
	    		this.historyIndex++;
			} 
		}	
  	}

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
    	if (!this.config.states[this.activeState].transitions[event]) {
    		throw new Error(this.message.triggerError);
    	} 
    	for (var state in this.config.states) {
    	  	switch(this.activeState) {
    			case 'normal':
    			   for(var transition in this.config.states.normal.transitions) {
    			    	if (transition == event) {
	    			       this.activeState = this.config.states.normal.transitions[event];
	    			       this.stateHistory.push(this.activeState);
		    			   this.historyIndex++;
		    			   this.redoAvailable = true;
    			     	}
    			   	}
    			    break;
    			case 'busy':
    				for(transition in this.config.states.busy.transitions) {
    			    	if (transition == event) {
	    			        this.activeState = this.config.states.busy.transitions[event];
	    			        this.stateHistory.push(this.activeState);
		    			   	this.historyIndex++;
		    			   	this.redoAvailable = true;
    			      	} 
    			    }
    			    break;
    			case 'hungry':
    				for(transition in this.config.states.hungry.transitions) {
    			    	if (transition == event) {
	    			        this.activeState = this.config.states.hungry.transitions[event];
	    			        this.stateHistory.push(this.activeState);
		    			   	this.historyIndex++;
		    			   	this.redoAvailable = true;
    			      	} 
    			    }
    			    break;  
    			case 'sleeping':
    				for(transition in this.config.states.sleeping.transitions) {
    			    	if (transition == event) {
	    			    	this.activeState = this.config.states.sleeping.transitions[event];
	    			        this.stateHistory.push(this.activeState);
		    			   	this.historyIndex++;
		    			   	this.redoAvailable = true;
    			      	} 
    			    }
    			    break;   
    			default:
    			  	break;
    		}
    	}
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
    	this.activeState = this.config.initial;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
    	var statesList = [];
    	var statesForEvent = [];
    	if(!event) {
    		var statesList = [];
	    	for (var state in this.config.states) {
	    		statesList.push(state);  
	        }
	    	return statesList;    
	    } 
	    for (var state in this.config.states) {
	   		for (var transition in this.config.states[state].transitions) {
	   			if (transition == event) {
	    		  statesForEvent.push(state);
	    		}
	    	}
		}
    	return statesForEvent;
	}
	

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.historyIndex > 1) {
            this.historyIndex -= 2;
            this.activeState = this.stateHistory[this.historyIndex];
            this.historyIndex++;
            this.redoAvailable = true;
            return true;
        }
        return false;
    }
    

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
    	if (this.redoAvailable && this.stateHistory.length > this.historyIndex) {
            this.activeState = this.stateHistory[this.historyIndex];
            this.historyIndex += 2;
            this.redoAvailable = false;
            return true;
        } 
        return false;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.stateHistory = [];
        this.historyIndex = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
