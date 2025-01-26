
import fs   from 'fs';
import path from 'path';
import util from 'util';
import { EOL } from 'node:os'  
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

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
  MOVE
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
  // target:       MapContent|null
}

interface MapContent {
  subject:    'actor'|'item'
  id:         number

}


/* --- classes --- */

class Jeopardy {
  turnCounter = 0;
  constructor(){
    createPrismaMapFromFile( path.join( 'src', 'lib', 'jeopardy', 'data', 'map.txt' ));
    createActor( 'Number Two' );
  
  }

  game(){
    setInterval(
      async()=>{
        // iterate over actors -> nextAction
        const actors = await prisma.actor.findMany();
        actors.forEach( async( actor )=>{
          // '0 0'
          let nextAction = actor.nextAction?.split( ' ' ).map( n => parseInt( n ))
          console.log( `Actor ${ actor.id } nextAction: ${ nextAction }` )          
          // if()
          // else if()
          
        })
        // Actors aus DB
        // actions aus nextAction abarbeiten
        // uU per turn Dinge erledigen
      }
    , SPEX.HEARTBEAT
    )
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
  console.log( `New Actor  ${ util.inspect( ret ) }` )
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