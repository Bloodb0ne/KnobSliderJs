# KnobSliderJs
A simple circular slider

#Usage
This is the required markup for the slider
``` html
<div class='knob ui-knob'>
        <div class='ui-knob-container'>
            <div class='ui-knob-indicator'></div>
        </div>
        <div class='percentage'>100%</div>
</div>

```

After you created the elements you just need to init it, like you would with any other

``` javascript
$('.knob').Knob({});
```

#Events
**knob:change** - triggered when the value of the slider changes

