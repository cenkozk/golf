
import { _decorator, Component, Node, CircleCollider2D, Contact2DType, AudioSource, find, AudioClip, IPhysics2DContact, RigidBody2D, clamp, Vec2, tween, Vec3, Prefab, instantiate, director, sp, BaseNode } from 'cc';
const { ccclass, property } = _decorator;
import { TouchHandler } from './touchHandler';
import { LevelManager } from './levelManager';

@ccclass('BallCollision')
export class BallCollision extends Component {
    
    col:CircleCollider2D = null!;
    audioManager:AudioSource = null!;
    RB2D:RigidBody2D=null!;
    camera:Node = null!;

    @property(AudioClip)
    wood_Hit_Clip:AudioClip = null!;

    @property(Prefab)
    ballObject:Prefab = null!;


    start () {
       this.col = this.node.getComponent(CircleCollider2D)!;
       this.audioManager = find('Canvas/audioManager')?.getComponent(AudioSource)!
       this.camera = find('Canvas/Camera')!;
       this.RB2D = this.node.getComponent(RigidBody2D)!;

       this.col.on(Contact2DType.BEGIN_CONTACT,this.contact,this);
       this.col.on(Contact2DType.END_CONTACT, this.endContact, this);
    }
    contact(selfCollider: CircleCollider2D, otherCollider: any, contact: IPhysics2DContact | null){
        var vel = this.RB2D.linearVelocity;
        var magnitude = vel.x*vel.x+vel.y*vel.y;


        if(otherCollider.node.name == "walls"){
            this.audioManager.volume = clamp(Math.abs(magnitude) / 100,0,0.8);
            this.audioManager.clip = this.wood_Hit_Clip;
            this.audioManager.play();
        }

        if(otherCollider.node.name == "hole"){
            if(magnitude < 15){
                TouchHandler.ifHoleIn = true;
                LevelManager.currentLevel += 1;
                var cLevel = find(`Canvas/Layout/level_${LevelManager.currentLevel-1}`)!;
                var openLevel = find(`Canvas/Layout/level_${LevelManager.currentLevel}`)!;
                openLevel.active = true;
                var spawnObject = instantiate(this.ballObject);
                spawnObject.setParent(openLevel); 
                spawnObject.setPosition(16,-240,0);
                spawnObject.active = true;
                console.log(spawnObject);
                console.log(openLevel);
                var colPos = otherCollider.node.getComponent(CircleCollider2D).offset;
                this.RB2D.linearVelocity = new Vec2(0,0);
                tween(this.node)
                .to(1,{position: new Vec3(colPos.x,colPos.y,0)},{easing:'bounceInOut'})
                .start();
                this.scheduleOnce(() =>{tween(this.camera)
                .to(1.5,{position: new Vec3(this.camera.position.x,this.camera.position.y+750,0)},{easing:'quartInOut'})
                .start();
                },1)
                this.scheduleOnce(() =>{
                    var cBall = find(`Canvas/Layout/level_${LevelManager.currentLevel-1}/ball`)!;
                    //cBall.destroy();
                    cLevel.destroy();
                },3.5)
            }else{
                this.RB2D.linearDamping = 10;
            }
        }
        
    }

    endContact(selfCollider: CircleCollider2D, otherCollider: any, contact: IPhysics2DContact | null) {
        if(otherCollider.node.name){
            this.RB2D.linearDamping = 1;
        }
    }

    
}
