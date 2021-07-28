
import { _decorator, Component, Node, tween, Vec2, Vec3, SystemEventType, CCBoolean, color, Color, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ToggleSlider')
export class ToggleSlider extends Component {
    
    
    private toggleBall:Node = null!;
    toggleColor:Sprite = null!;
    private isChanging:Boolean = false;

    @property(CCBoolean)
    public isChecked:Boolean = false;

    @property(Color)
    colorEnabled:Color = new Color(77,204,53,255);
    
    @property(Color)
    colorDisabled:Color = new Color(211,42,76,255);

    start () {
        this.toggleBall = this.node.children[0];
        this.toggleColor = this.toggleBall.getComponent(Sprite)!;
        
        this.node.on(SystemEventType.TOUCH_START,this.funcBool,this);
        if(this.isChecked == false){
            this.toggleBall.setPosition(-56,0,0);
            this.toggleColor.color = this.colorDisabled;
        }else{
            this.toggleBall.setPosition(56,0,0);
            this.toggleColor.color = this.colorEnabled;
        }
    }

    funcBool(){
        if(this.isChanging == false){
            if(this.isChecked == false){
                this.tweenEnabled();
            }else{
                this.tweenDisabled();
            }
        }
    }

    tweenEnabled(){
        this.isChecked = true;
        this.toggleColor.color = this.colorEnabled;
        tween(this.toggleBall)
        .to(0.2,{position: new Vec3(56,0,0)},{easing:'sineInOut'})
        .union()
        .start();
        this.isChanging = true;
        setTimeout(() => {
            this.isChanging = false;
        }, 200);
    }

    tweenDisabled(){
        this.isChecked = false;
        this.toggleColor.color = this.colorDisabled;
        tween(this.toggleBall)
        .to(0.2,{position: new Vec3(-56,0,0)},{easing:'sineInOut'})
        .union()
        .start();
        this.isChanging = true;
        setTimeout(() => {
            this.isChanging = false;
        }, 200);
    }
}
