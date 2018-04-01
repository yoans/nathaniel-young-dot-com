// This is a Fortran program that compiles using g95
// Written By NATHANIEL YOUNG
//
// TOY CANNON
// destroy pixels with pixels please//
//
//Start Program
//Declare One billion variables
const animationStyles = [];
const grid = [];//(39,39,10)
let terrainChar='|';// initial terrain ???;
let targetChar='X';// initial target q
let skyChar=' ';// initial sky e
let turretChar='O';// initial turret r
let projectileChar='*';// initial porjectile
let grito = []//(10,10)
let column = 0;
let row = 0;
let rcc = 0;
let i = 0;
let j = 0;
let k = 0;
let x = 0;
let yy = 0;
let w = 0;
let ans = 1;
let answ = 0;
let answe = 0;
let answer = 0;
let size = 39; //this is the size of the grid used to display the graphis
let para = 0;
let targn = 0;
let y = [];
let rtt = [];
let jj = 0;
let kk = 0;
let stup = 0;
let score = 0;
let targets = 1;//initial number of targets that apear on the screen
let shots = 10;
let move = 3;//move is the variable used to change how the cannon shot is animated
let self = 0;
let hit = 0;
let columno = 0;
let rowo = 0;
let an = 0;
let rc = 0;
let rs = 0;
let rl = 0;
let m = 0;
let xx = 0;
let b = 0;
let mslope = 3.0;//this variable is the intial slope of the line that crosses the screen to create the varying terrain
let rt = [];
let mult = 0;
let angle = 0.0; //initial Angle of cannon measured from the right in degrees
let vel = 0.0;
let cangle = 0.0;//angle converted to radians
let time = 0;
let timeo = 0;
let velx = 0;
let vely = 0;
let velc = 0;
let posx = 0;
let posy = 0;
animationStyles[1]='very slow'; //these four variables are used to the animation of the cannon shot
animationStyles[2]='controled';
animationStyles[3]='very fast';
animationStyles[4]='instantainious';

////////
//////////////////     START GAME
////////
//////////// The first part of the game allows the user to customize the terrain and become familiar with what everything is represented by
//////
// do//phase 1 setup characers
//     call system('cls')//Clears screen to start drawing a picture for the user
//     do i=1,8 //Writes the character variable e 20 times 8 lines in a row
//         write(*,10)(skyChar,j=1,20)
//     end do //note that a do loop can hang out inside another do loop.
//     write(*,10)(skyChar,i=1,5),turretChar,turretChar,turretChar,(projectileChar,i=1,4),targetChar,targetChar,targetChar,(skyChar,i=1,5) //more ASCII art..
//     write(*,10)(skyChar,i=1,5),turretChar,turretChar,turretChar,(skyChar,i=1,4),targetChar,targetChar,targetChar,(skyChar,i=1,5) //there has got to be a better way haha
//     write(*,10)(terrainChar,i=1,5),turretChar,turretChar,turretChar,(terrainChar,i=1,4),targetChar,targetChar,targetChar,(terrainChar,i=1,5) //we will see some pretty stuff later
//     do i=1,9//Continue Picture Note that this loop does its thing NINE times...
//         write(*,10)(terrainChar,j=1,20)//finishes picture with ground slash terrain earth.. "u"
//     end do
//     write(*,*)"Enter (1) to change the terrain.   (",terrainChar,")"
//     write(*,*)"Enter (2) to change the sky.       (",skyChar,")"   //////////This is what the user will read.
//     write(*,*)"Enter (3) to change the cannon.    (",turretChar,")"
//     write(*,*)"Enter (4) to change the targets.   (",targetChar,")"
//     write(*,*)"Enter (5) to change the projectile.(",projectileChar,")"
//     write(*,*)"Enter (6) to continue."
//     write(*,*)"Enter (7) to quit."
//     read(*,*)an
//     if(an==1)then//basic if then statement means.. if "something" then do everything til i say end if.. otherwise.. ignore everything until the end if
//         write(*,*)"Enter a letter or symbol for the terrain."
//         read(*,*)terrainChar//replaces the current character with what ever character the user wants to use for the rest of the program.
//     end if
//     if(an==2)then
//         write(*,*)"Enter a letter or symbol for the sky."
//         read(*,*)skyChar//same story
//     end if
//     if(an==3)then
//         write(*,*)"Enter a letter or symbol cannon."
//         read(*,*)turretChar
//     end if
//     if(an==4)then
//         write(*,*)"Enter a letter or symbol for the targets."
//         read(*,*)targetChar
//     end if
//     if(an==5)then
//         write(*,*)"Enter a letter or symbol for the projectile."
//         read(*,*)projectileChar
//     end if
//     if(an==6)then  //// option 6 Allows the program to continue on by "EXITING" the do loop
//         exit
//     end if
//     if(an==7)then  //// option 7 "stops" the program. Quits the game. bye bye
//         call system('cls') //just to clean up the screen for the user.
//         stop
//     end if
// end do//That is the end of the big do loop

//////Now that all the symbols are picked and represented we can start constructing mountains
//////
//////////////
////////////////////////////MOUNTAIN CONSTRUCTOR
//  //   //   //   //
//////              \/\/\/\/\/\/\/\/\
//
//
//
//                               ////
//                            //////////
//      //////               //////////////////
//     //////////             ////////////////////
//    //////////////          ////////////////////////
// //////////////////////////    //////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////stick with me this gets a little rough
//////the user has the option of randomly generating the terrain as many times as they want.
////the user can change the average slope, and the size of the screen.


do
    if (ans==6) then
        exit
    end if
    rs=(rs*size*.25)+size*.65
    grid=skyChar
    y(1)=nint(rs)
    grid(1,nint(rs),1)='u'
    rl=0
    do column=1,size
        if(column>rl)then
            call random_number (m)
            call random_number(xx)
            if(xx>.5)then
                m=-m
            end if
            m=m*(mslope)
            b=(y(column))-m*real(column)
        end if
        if(column>rl)then
            call random_number (rl)
            rl=(rl*size*.1)+1.
            rl=nint(rl)
            rl=rl+column
            if(rl>size)then
                rl=size
            end if
        end if
        if(y(column)>size*.8)then
            m=-sqrt(m**2.)
            b=(y(column))-m*real(column)
            y(column+1)=m*real(column+1)+b
        end if
        if(y(column)<size*.5)then
            m=sqrt(m**2.)
            b=(y(column))-m*real(column)
            y(column+1)=m*real(column+1)+b
        end if
        if(y(column)<=size*.8 .and. y(column)>=size*.5)then
            y(column+1)=m*real(column+1)+b
        end if
        do row=1,size
            if(row>=y(column))then
                grid(column,row,1)=terrainChar
            end if
        end do
    end do
    do row=1,size
        do column=1,size
        if (row>=.9*size)then
            grid(column,row,4)=terrainChar
        end if
        end do
    end do
    do
        call system('cls')
        do yy=1,size
            write(*,10) (grid(x,yy,1), x=1,size)
        end do
        10 format(100(' ',a1))
        write(*,*)"Enter (1) for a smaller screen."
        write(*,*)"Enter (2) for a larger screen."
        write(*,*)"Enter (3) to decrease maximum slope."
        write(*,*)"Enter (4) to increase maximum slope."
        write(*,*)"Enter (5) to randomize"
        write(*,*)"Enter (6) to continue"
        write(*,*)"Enter (7) to quit."
        read(*,*)ans
        if (ans==1) then
            size=size-1
            if (size<=20)then
                write(*,*)"No can do."
                pause
                size=size+1
            end if
            exit
        end if
        if (ans==2) then
            size=size+1
            if (size>=40)then
                write(*,*)"No can do."
                pause
                size=size-1
            end if
            exit
        end if
        if (ans==6) then
            exit
        end if
        if(ans==7) then
            call system('cls')
            stop
        end if
        if(ans==3)then
            mslope=mslope-.5
            if(mslope<0.)then
                write(*,*)"No can do."
                pause
                mslope=mslope+.5
            end if
            exit
        end if
        if(ans==4)then
            mslope=mslope+.5
            if(mslope>=5)then
                write(*,*)"No can do."
                pause
                mslope=mslope-.5
            end if
            exit
        end if
        if(ans==5)then
            exit
        end if
    end do
end do
do
    do j=1,size
        do k=1,size
            grid(j,k,2)=grid(j,k,1)
        end do
    end do
    call random_number(rc)
    rcc=nint((rc)*(size-3))+2
    do row=1, size
        if(grid(rcc,row,2)==terrainChar .or. grid(rcc+1,row,2)==terrainChar .or. grid(rcc-1,row,2)==terrainChar)then
            para=row-1
            do j=-1,1
                do k=0,2
                    grid(rcc+j,row-k,2)=r
                end do
            end do
            exit
        end if
    end do
    do
        call system('cls')
        do yy=1,size
            write(*,10) (grid(x,yy,2), x=1,size)
        end do
        write(*,*)"Enter (1) to change position"
        write(*,*)"Enter (2) to continue."
        write(*,*)"Enter (3) to quit."
        read(*,*)answ
        if(answ==1)then
            exit
        end if
        if(answ==2)then
            exit
        end if
        if(answ==3)then
            call system('cls')
            stop
        end if
    end do
    if(answ==2)then
        exit
    end if
end do

do
    do j=1,size
        do k=1,size
            grid(j,k,3)=grid(j,k,2)
        end do
    end do
    do j=1,targets
        do
            stup=0
            call random_number(rt(j))
            rtt(j)=nint(rt(j)*(size-3))+2
            do row=1,size
                if(grid(rtt(j),row,3)==turretChar .or. grid(rtt(j)+1,row,3)==turretChar .or. grid(rtt(j)-1,row,3)==turretChar)then
                    exit
                end if
                if(grid(rtt(j),row,3)==targetChar .or. grid(rtt(j)+1,row,3)==targetChar .or. grid(rtt(j)-1,row,3)==targetChar)then
                    exit
                end if
            if(grid(rtt(j),row,3)==terrainChar .or. grid(rtt(j)+1,row,3)==terrainChar .or. grid(rtt(j)-1,row,3)==terrainChar)then
                stup=1
                do jj=-1,1
                    do k=0,2
                        grid(rtt(j)+jj,row-k,3)=targetChar
                    end do
                end do
                exit
            end if
        end do
        if(stup==1)then
            exit
        end if
    end do
end do
do
    call system('cls')
    do yy=1,size
        write(*,10) (grid(x,yy,3), x=1,size)
    end do
    write(*,*)"Enter (1) for fewer targets."
    write(*,*)"Enter (2) for more targets."
    write(*,*)"Enter (3) to change target locations."
    write(*,*)"Enter (4) to continue."
    write(*,*)"Enter (5) to quit."
    read(*,*)answe
    if(answe==1)then
        if(targets-1>0)then
            targets=targets-1
            exit
        end if
        write(*,*)"No can do."
        pause
        exit
    end if
    if(answe==2)then
        if(targets+1<=size/4)then
            targets=targets+1
            exit
        end if
        write(*,*)"No can do."
        pause
        exit
    end if
    if(answe==3)then
        exit
    end if
    if(answe==4)then
        exit
    end if
    if(answe==5)then
        call system('cls')
        stop
    end if
end do
if(answe==4)then
    exit
end if
end do



do j=1,size
    do k=1,size
        grid(j,k,4)=grid(j,k,3)
    end do
end do
do
    do j=-1,1
        do k=-1,1
            grid(rcc+j,para-k,4)=turretChar
        end do
    end do
    do row=1,size
        do column=1,size
            if (row>=.9*size)then
                grid(column,row,4)=terrainChar
            end if
        end do
    end do
    call system('cls')
    do yy=1,size
        write(*,10) (grid(x,yy,4), x=1,size)
    end do
    write(*,*)"Multiplier:",mult
    write(*,*)"Score:",score
    write(*,*)"Targets left:",targets
    write(*,*)"(1)Angle:",angle
    write(*,*)"(2)Velocity:",vel
    write(*,*)"(3)Fire: ",shots," shots left"
    write(*,*)"(4)Change animation from ",animationStyles(move)
    write(*,*)"(5)Self Destruct"
    read(*,*)answer
    if(answer==1)then
        write(*,*)"What angle in degrees do you want to use?"
        read(*,*) angle
        cangle=angle*3.141592653/180.
    end if
    if(answer==2)then
        write(*,*)"What velocity in meters per second do you want to use?"
        read(*,*)vel
    end if
    if(answer==4)then
        Write(*,*)"Enter 1 for very slow, 2 for controled, 3 for fast, 4 for instantainious."
        read(*,*)move
    end if
    if(answer==5)then
        do j=1,size
            do k=1,size
                grid(j,k,5)=grid(j,k,4)
            end do
        end do
        do i=0, 10
            do row=-i, i
                do column=-i, i
                    grid(rcc+column,para+row,5)=d
                    grid(rcc+column,para+row,4)=skyChar
                end do
            end do
            if(move/=4)then
                call system('cls')
                do yy=1,size
                    write(*,10) (grid(x,yy,5), x=1,size)
                end do
            end if
            if(move==1)then
                call sleep(1)
            end if
            if(move==2)then
                pause
            end if
        end do
        pause
        call system('cls')
        do yy=1,size
            write(*,10) (grid(x,yy,4), x=1,size)
        end do
        pause
        call system('cls')
        stop
    end if
    if(answer==3)then
        do j=1,size
            do k=1,size
                grid(j,k,5)=grid(j,k,4)
            end do
        end do
        time=0.
        timeo=1./(vel)
        i=0
        hit=0
        do
            velx=cos(cangle)*vel
            vely=-sin(cangle)*vel+2.*time
            velc=sqrt(vely**2.+velx**2.)
            timeo=1./velc
            if(velc<=1.)then
                timeo=.9
            end if
            time=time+timeo*.9
            posx=cos(cangle)*vel*time+rcc
            posy=-sin(cangle)*vel*time+time**2+para
            if(move/=4)then
                call system('cls')
                do yy=1,size
                    write(*,10) (grid(x,yy,5), x=1,size)
                end do
            end if
            if(move==1)then
                call sleep(1)
            end if
            if(move==2)then
                pause
            end if
            if(grid(nint(posx),nint(posy),5)==terrainChar)then
                do column=-2,2
                    do row=-2,2
                        if(grid(nint(posx)+column,nint(posy)+row,5)==targetChar)then
                            hit=1
                            targets=targets-1
                            do columno=-2,2
                                do rowo=-2,2
                                    grid(nint(posx)+column+columno,nint(posy)+row+rowo,5)=projectileChar
                                    grid(nint(posx)+column+columno,nint(posy)+row+rowo,4)=skyChar
                                end do
                            end do
                        end if
                        grid(nint(posx)+column,nint(posy)+row,5)=projectileChar
                        grid(nint(posx)+column,nint(posy)+row,4)=skyChar
                    end do
                end do
                call system('cls')
                do yy=1,size
                    write(*,10) (grid(x,yy,5), x=1,size)
                end do
                if(hit==0)then
                    write(*,*)"Miss"
                    mult=0
                end if
                if(hit==1)then
                    mult=mult+1
                    targets=targets-1
                    score=score+mult
                end if
                shots=shots-1
                pause
                do j=1,size
                    do k=1,size
                        grid(j,k,6)=grid(j,k,5)
                    end do
                end do
                exit
            end if
            if(grid(nint(posx),nint(posy),5)==targetChar)then
                hit=1
                do column=-2,2
                    do row=-2,2
                        if(grid(nint(posx)+column,nint(posy)+row,4)==targetChar)then
                            hit=2
                            do columno=-2,2
                                do rowo=-2,2
                                    grid(nint(posx)+column+columno,nint(posy)+row+rowo,5)=projectileChar
                                    grid(nint(posx)+columno+column,nint(posy)+row+rowo,4)=skyChar
                                end do
                            end do
                        end if
                        grid(nint(posx)+column,nint(posy)+row,5)=projectileChar
                        grid(nint(posx)+column,nint(posy)+row,4)=skyChar
                    end do
                end do
                call system('cls')
                do yy=1,size
                    write(*,10) (grid(x,yy,5), x=1,size)
                end do
                write(*,*)"HIT"
                mult=mult+hit
                shots=shots-1
                targets=targets-hit
                score=score+mult
                pause
                exit
                do j=1,size
                    do k=1,size
                        grid(j,k,5)=grid(j,k,4)
                    end do
                end do
            end if
            grid(nint(posx),nint(posy),5)=projectileChar
        end do
    end if
end do
//end program cannon