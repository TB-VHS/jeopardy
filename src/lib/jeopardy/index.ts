
import fs   from 'fs';
import path from 'path';
import util from 'util';
import { EOL } from 'node:os'
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { NONAME } from 'node:dns';

const prisma = new PrismaClient();

enum SPEX {
  W = 100
, H = 100
, HEARTBEAT = 10_000
}

enum DIRECTION {
  NORTH
, EAST
, SOUTH
, WEST
}

enum ACTION_TYPE {
  NONE
, MOVE
, PICK_UP
, DROP
, HIT

}

interface MapTileDataset {
  coordX:     number
  coordY:     number
  terrain:    string
}

interface ActorDataset {
  token:      string
  actorname:  string
}

interface ActorAction {
  actionType:   ACTION_TYPE
  direction:    DIRECTION|null
  target:       MapContent|null
}

interface MapContent {
  subject:    'actor'|'item'
  id:         number

}


/* --- classes --- */

class Jeopardy {
  turnCounter = 0;
  constructor(){
    this.initGame( false, 10, 0 );
    this.runGame()
  }

  async runGame(){
    setInterval(
      async()=>{
        this.turnCounter++
        console.log( `Turn ${ this.turnCounter } - iterate over actors table` )

        const actors = await prisma.actor.findMany();
        console.log( `${ actors.length } actors found:`)
        console.log( `${ actors.map( a => util.inspect( a )) }`)
        let nextAction: ActorAction|null;
        actors.forEach( async( actor )=>{
          if( actor.nextAction !== null ){
            nextAction = JSON.parse( actor.nextAction );
            console.log( `Actor ${ actor.id } nextAction: ${ util.inspect( nextAction ) }` );
          }
          else {
            nextAction = {
              actionType: ACTION_TYPE.NONE
            , direction: DIRECTION.NORTH
            , target: null
            }
          }
          // actions aus nextAction abarbeiten
          // if()
          // else if()

        })
        // uU per turn Dinge erledigen
      }
    , SPEX.HEARTBEAT
    )
  }

  async initGame( createMap=true, actorN=0, itemN=0 ){
    if( createMap ){
      await createPrismaMapFromFile( path.join("src", "lib", "jeopardy", "data", "map.txt"))
    }
    // for( let i = 0; i < actorN; i++ )
    //   await createActor( `Actor ${ Math.random().toString(16).substring(2, 7).toUpperCase() }`);
  }



}


/* --- functions --- */

async function createActor( actorname: string ){
  const x     = Math.trunc( Math.random() * SPEX.W )
  ,     y     = Math.trunc( Math.random() * SPEX.H )
  ,     token = uuidv4()
  ;

  const ret = await prisma.actor.create({
    data: {
      token:      token
    , actorname:  actorname
    }
  })
  // console.log( `New Actor  ${ util.inspect( ret ) }` )
  writeContentToMapTile( x, y, { subject: 'actor', id: ret.id })
  console.log( `New Actor  ${ ret.id } @ ${ x }|${ y }` )
}


async function writeContentToMapTile( x: number, y: number, contentData: MapContent ): Promise<void> {
  await prisma.mapTile.update({
    where: {
      coords: {
        coordX: x
      , coordY: y
      }
    }
  , data: {
      content: JSON.stringify( contentData )
    }
  })
}


async function createPrismaMapFromFile( filePath: string ): Promise<void> {
  const map = fs.readFileSync( filePath, { encoding: 'utf8' });
  const mapLines = map.split( EOL );
  console.log( `Anzahl mapLines: ${ mapLines.length }` )
  for( let iy = 0; iy < mapLines.length; iy++ ){
    let mapLineDatasets: MapTileDataset[] = [];
    let mapTileTerrains = mapLines[ iy ].split( '' );
    for( let ix = 0; ix < mapTileTerrains.length; ix++ ){
      let dataset: MapTileDataset = {
        coordX:   ix
      , coordY:   iy
      , terrain:  mapTileTerrains[ ix ]
      }
      console.log ( `MapTileDataset: ${ util.inspect( dataset )}` );
      mapLineDatasets.push( dataset );
    }
    let retQuery = await prisma.mapTile.createMany({ data: mapLineDatasets })
  }
}




/* --- exports --- */

export default Jeopardy