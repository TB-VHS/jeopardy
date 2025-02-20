import dotenv from 'dotenv';
dotenv.config();

import util from 'util';
import { hashSync, compareSync } from 'bcryptjs';
import express, { Express, Request, Response } from "express";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars';
import { PrismaClient } from '@prisma/client';

const port = process.env.PORT || 3000;

const app: Express = express();
app.engine( 'handlebars', engine() );
app.set( 'view engine', 'handlebars' );
app.set( 'views', 'views' );
app.use( express.static( 'public' ));
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }));
app.use( cookieParser() );

const prisma = new PrismaClient();

let terrainMapping = new Map<string, string>([
  [ 'B', 'boreal' ]
, [ 'C', 'conifer' ]
, [ 'G', 'grass' ]
, [ 'R', 'rock' ]
, [ 'W', 'water' ]
])



/* --- routes --- */
app.get( '/'
, async( req: Request, res: Response )=>{
    res.redirect( 'login' );
});

app.get( '/login'
, async( req: Request, res: Response )=>{
    res.render( 'login', { title: 'Login' });
});

app.post( '/login'
, async( req: Request, res: Response )=>{
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email
      }
    });
    if( user === null ){
      res.redirect( '/login' );
    }
    const pwHash = user?.pwHash ? user?.pwHash : '';
    const authenticated = compareSync( req.body.password, pwHash )
    console.log( user )
    if( authenticated === false ){
      res.redirect( '/login' );
    }
    else{ // if user not null
      res.cookie( 'username', user?.username, { maxAge: 3_600_000 });
      res.cookie( 'userId', user?.id, { maxAge: 3_600_000 });
      res.redirect( '/jeopardy' );
    }
});

app.post( '/api/move'
, async( req: Request, res: Response )=>{
    console.log( `COMMAND: ${ req.body.command }` )
})

app.get( '/jeopardy'
, async( req: Request, res: Response )=>{
    const username = req.cookies.username;
    const userId = parseInt( req.cookies.userId );
    const user = await prisma.user.findUnique({ where: { id: userId }});
    const actor = await prisma.actor.findUnique({ where: { id: user?.actorId }});
    const lox = user?.mapSectionX ? user?.mapSectionX : 0;
    const loy = user?.mapSectionY ? user?.mapSectionY : 0;
    let mapTiles = await prisma.mapTile.findMany({
      where: {
        coordX: { gt: lox, lte: lox + 11 }
      , coordY: { gt: loy, lte: loy + 11 }
    }});
    console.log( `Map Section:`)
    // console.log( `${ mapTiles.map( m => util.inspect( m ))}` )
    const bgSprites = mapTiles.map( m =>{
      return {
                terrain: m.terrain
              , x:  ( m.coordX - lox - 1 ) * 64
              , y:  ( m.coordY - loy - 1 ) * 64
              }
    })
    const mgSprites = mapTiles.map( m =>{
      return {
                terrainSprite:  terrainMapping.get( m.terrain ) + '01'
              , x:  ( m.coordX - lox - 1 ) * 64
              , y:  ( m.coordY - loy - 1 ) * 64
              }
    })
    const fgSpritesPromises = mapTiles.map( async m => {
      let spriteFile: string|undefined = '0.png'
      ,   actorname: string|undefined = ''
      ;
      if( m.content !== '' ){
        let content = JSON.parse( m.content );
        if( content.subject === 'actor' ){
          const a = await prisma.actor.findUnique({ where: { id: content.id }});
          console.log( `a: ${ util.inspect( a )}` )
          spriteFile = a?.spriteFile;
          actorname = a?.actorname;
        }
      }
      return {
        spriteFile: spriteFile
      , actorname: actorname
      , x:  ( m.coordX - lox - 1 ) * 64
      , y:  ( m.coordY - loy - 1 ) * 64
      }
    })
    const fgSprites = await Promise.all( fgSpritesPromises )
    res.render( 'jeopardy', { title: 'Jeopardy - Game', userName: username, bgSprites: bgSprites, mgSprites: mgSprites, fgSprites: fgSprites });
});



app.listen(
    port
,   () => {
      console.log( `[server]: Server is running at http://localhost:${ port }` );
});

