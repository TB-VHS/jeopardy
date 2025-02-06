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

const prisma = new PrismaClient();
const app: Express = express();
app.engine( 'handlebars', engine() );
app.set( 'view engine', 'handlebars' );
app.set( 'views', 'views' );
app.use( express.static( 'public' ));
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }));
app.use( cookieParser() );


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

app.get( '/jeopardy'
, async( req: Request, res: Response )=>{
    const username = req.cookies.username;
    const userId = parseInt( req.cookies.userId );
    const user = await prisma.user.findUnique({ where: { id: userId }});
    const actor = await prisma.actor.findUnique({ where: { id: user?.actorId }});
    const lox = user?.mapSectionX ? user?.mapSectionX : 0;
    const loy = user?.mapSectionY ? user?.mapSectionY : 0;
    let map = await prisma.mapTile.findMany({
      where: {
        coordX: { gt: lox, lte: lox + 10 }
      , coordY: { gt: loy, lte: loy + 10 }
    }});
    console.log( `Map Section:`)
    console.log( `${ map.map( m => util.inspect( m ))}`)
    const mapTiles = map.map( m =>{
      let terrain: string;
      let content: any;
      let img = '';
      switch( m.terrain ){
        case 'G':
          terrain = 'grass';
          break;
        case 'B':
          terrain = 'boreal';
          break;
        case 'C':
          terrain = 'coniferous';
          break;
        case 'W':
          terrain = 'water';
          break;
        case 'R':
          terrain = 'rock';
          break;
        default:
          terrain = ''
      }
      if( m.content !== '' ){
          content = JSON.parse( m.content );
          if( content.subject === 'actor' && content.id === 1 ){
            img = 'sprites/actor01.png'
          }
      }
      return { x: m.coordX, y: m.coordY, terrain: terrain, img: img  }
    })
    res.render( 'jeopardy', { title: 'Jeopardy - Game', userName: username, mapTiles: mapTiles });
});



app.listen(
    port
,   () => {
      console.log( `[server]: Server is running at http://localhost:${ port }` );
});

