/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, Component, ReactNode } from 'react';
import { 
  Home, 
  Search, 
  PlusSquare, 
  Heart, 
  User, 
  MoreHorizontal, 
  CheckCircle2, 
  Grid, 
  Settings,
  X,
  Trash2,
  Image as ImageIcon,
  Menu,
  Moon,
  Sun,
  ChevronLeft,
  Camera,
  LogOut,
  MessageCircle,
  Send,
  Play,
  Video,
  Maximize2,
  Share2,
  Music,
  MoreVertical,
  Volume2,
  VolumeX,
  Download,
  AlertCircle,
  Clapperboard,
  Phone,
  UserPlus,
  Link,
  Copy,
  Upload,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { get, set } from 'idb-keyval';
import { Profile, Post, Conversation, Message } from './types';

const STORAGE_KEY = 'intragram_data';

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
};

const RANDOM_COMMENTS = [
  "Damn that ass fat af 🍑",
  "What an ass let me clap it",
  "Balloon boobs looking crazy inflated 🎈🍒",
  "Let me hold these melons real quick",
  "Bitch got that cake I’m tryna smash",
  "Ass so phat I’m in love fr",
  "Those tits bouncin like damn",
  "GYAT damn that body wild",
  "Can I motorboat these balloons",
  "What a thick ass gyal 🍑💦",
  "Let me bury my face in that ass",
  "Boobs too big I can’t look away",
  "Ass so fat shaped like the moon",
  "Tits lookin heavy af let me hold em",
  "Bitch you tryna kill me with that body",
  "Let me slap that ass once",
  "Balloon boobs alert who inflated these",
  "What an ass mama I’m tryna hit",
  "Those cheeks clap louder than my speakers",
  "Let me take a bite of that cake 🍑",
  "Tits so perky I’m obsessed",
  "Ass looking edible af",
  "Can I get between them thighs",
  "Bitch got me hard just scrolling",
  "Balloon boobs bouncin everywhere",
  "What a phatty let me grip it",
  "Let me hold these boobs while I hit it",
  "Ass too fat for one hand",
  "Tits look like they need attention",
  "Damn sis that ass bussin",
  "Let me smack that cake 🍑",
  "Bitch you built different",
  "Balloon boobs tryna escape",
  "What an ass I’d live in it",
  "Those melons heavy let me support",
  "Ass so juicy I’m thirsty",
  "Let me face sit on that",
  "Tits too big to handle",
  "Bitch got that dumptruck 🍑",
  "Can I get a motorboat session",
  "Balloon boobs look fake but I don’t care",
  "What a thick bitch I’d wife",
  "Let me hold them while you ride",
  "Ass clapping in my dreams",
  "Tits so round perfect handfuls",
  "Damn that body illegal af",
  "Let me bury my face right there",
  "Bitch you got me simping hard",
  "Balloon boobs need a squeeze",
  "What an ass let me worship",
  "Those cheeks need oil",
  "Let me grip that phatty",
  "Tits bouncin like trampoline",
  "Ass fat enough to feed a village",
  "Can I get a private show",
  "Bitch built like a goddess but slutty",
  "Let me hold these balloons 🎈",
  "What a dumptruck ass",
  "Tits lookin delicious af",
  "Ass so fat it needs its own zip code",
  "Let me slap them cheeks red",
  "Balloon boobs tryna hypnotize me",
  "Bitch you too thick for clothes",
  "Can I get between that ass",
  "Those tits need a bra upgrade",
  "Damn mama that cake 🍰🍑",
  "Let me motorboat these melons",
  "What an ass I’m addicted",
  "Bitch got that perfect peach",
  "Tits so big they got gravity",
  "Ass looking like it needs spanking",
  "Let me hold them boobs all night",
  "Balloon boobs popping out",
  "What a juicy phatty",
  "Can I taste that ass",
  "Tits perfect for titty fucking",
  "Bitch you got me feral",
  "Let me grip that thick ass",
  "Ass so fat I’d quit my job",
  "Balloon boobs alert level 10",
  "What an ass let me dive in",
  "Those melons need attention bad",
  "Let me smack that cake hard",
  "Tits bouncin got me weak",
  "Bitch built for sin",
  "Can I get a face full",
  "Ass too phat to ignore",
  "Let me hold these while we fuck",
  "Balloon boobs looking ready",
  "What a thick goddess",
  "Tits so heavy they swing",
  "Damn that ass clap worthy",
  "Let me bury my dick in them cheeks",
  "Bitch you tryna get bred",
  "Tits need my hands on em",
  "Ass fat af let me clap",
  "Can I get a private motorboat",
  "Balloon boobs tryna escape top",
  "What an ass I’d die for",
  "Let me grip them thighs",
  "Tits looking edible 🍒",
  "Bitch got that WAP body",
  "Ass so juicy I’m drooling",
  "Let me hold these balloons all day",
  "What a phat ass queen",
  "Tits too big for one mouth",
  "Can I get that ass on my face",
  "Bitch you perfect slut material",
  "Balloon boobs need squeezing",
  "Let me smack that thick cake",
  "Ass looking like dessert",
  "Tits bouncin in slow mo",
  "Damn mama that body lethal",
  "Let me dive face first",
  "What an ass let me own it",
  "Bitch got me paying bills",
  "Can I get between them cheeks",
  "Balloon boobs inflation game strong",
  "Tits so round I’m staring",
  "Ass fat enough to break beds",
  "Let me hold these melons 🍉",
  "What a juicy dumptruck",
  "Bitch you got that gyat",
  "Tits need a warning label",
  "Can I motorboat for hours",
  "Let me grip that phatty hard",
  "Ass so fat it’s a crime",
  "Balloon boobs alert 🎈",
  "What an ass I’m simping",
  "Tits looking heavy duty",
  "Bitch built like a pornstar",
  "Let me bury my face in cake",
  "Can I get a taste test",
  "Balloon boobs too big to handle",
  "Ass clapping got me hooked",
  "Tits so perky perfect",
  "What a thick bitch fr",
  "Let me hold them while you twerk",
  "Bitch you too sexy dangerous",
  "Can I get that ass ride",
  "Tits bouncin like crazy",
  "Balloon boobs looking fake af but hot",
  "Ass so phat I’d marry",
  "Let me smack them cheeks",
  "What an ass let me worship daily",
  "Tits need my mouth",
  "Bitch got that body count rising",
  "Can I get private access",
  "Balloon boobs inflation max",
  "Let me grip that thick waist",
  "Ass fat af let me dive",
  "Tits so big they distract",
  "What a juicy peach 🍑",
  "Bitch you got me addicted",
  "Can I motorboat these",
  "Let me hold these boobs forever",
  "Balloon boobs tryna pop out",
  "Ass looking edible asf",
  "Tits perfect for play",
  "What an ass I’d risk it all",
  "Bitch built different thick",
  "Let me slap that cake 🍑",
  "Can I get face buried",
  "Tits bouncin got me gone",
  "Balloon boobs level expert",
  "Ass so fat it’s legendary",
  "Let me hold them melons",
  "What a phatty queen",
  "Bitch you tryna ruin lives",
  "Tits so round I’m obsessed",
  "Can I get that ass clap",
  "Balloon boobs alert everywhere",
  "Let me grip this body",
  "Ass fat enough for two hands",
  "What an ass let me claim it",
  "Tits looking ready to bounce",
  "Bitch got that perfect slut look",
  "Can I motorboat all night",
  "Let me hold these while I hit",
  "Balloon boobs too tempting",
  "Ass so phat I’m in heaven",
  "Tits heavy af let me support",
  "What a thick goddess body",
  "Bitch you got me feral af",
  "Can I get between them",
  "Let me smack that phat ass",
  "Balloon boobs looking inflated perfect",
  "Tits so big they own the room",
  "Ass fat af let me live there",
  "What an ass I’d never leave",
  "Bitch built for sin fr",
  "Can I get a private taste",
  "Let me hold these balloons tight",
  "Tits bouncin like they paid",
  "Balloon boobs tryna steal the show",
  "Ass so juicy I’m thirsty af",
  "What a phatty let me grip",
  "Bitch you too thick illegal",
  "Let me bury my face deep",
  "Tits perfect handfuls fr",
  "Can I get that cake smashed",
  "Balloon boobs alert maxed",
  "Ass clapping in my head",
  "Let me hold them melons all day",
  "What an ass let me own it forever",
  "Tits so round I stare",
  "Bitch got that body rizz",
  "Can I motorboat these heavy ones",
  "Let me slap that thick cake hard",
  "Balloon boobs looking ready to burst",
  "Ass fat af let me clap cheeks",
  "Tits heavy let me carry",
  "What a juicy dumptruck ass",
  "Bitch you perfect for this",
  "Can I get face full of ass",
  "Let me hold these boobs while riding",
  "Tits bouncin got me hooked bad",
  "Balloon boobs inflation game insane",
  "Ass so phat it’s art",
  "What an ass I’m obsessed daily",
  "Bitch built like a goddess slut",
  "Let me grip that phatty tight",
  "Can I get a taste of that cake",
  "Tits so big they need their own post",
  "Balloon boobs tryna escape bra",
  "Ass fat enough to break internet",
  "Let me hold them while you move",
  "What a thick ass queen fr",
  "Bitch you got me paying attention",
  "Can I motorboat for life",
  "Tits looking delicious heavy",
  "Balloon boobs alert level expert",
  "Ass so juicy I’d quit everything",
  "Let me smack them cheeks red",
  "What an ass let me dive face first",
  "Bitch got that perfect thick body",
  "Can I get between them thighs deep",
  "Tits perfect for my hands",
  "Balloon boobs looking inflated af",
  "Ass fat af let me worship it",
  "Let me hold these melons forever",
  "What a phatty I’m in love",
  "Bitch you tryna get me banned",
  "Can I get that ass on me",
  "Tits bouncin like they alive",
  "Balloon boobs too big too hot",
  "Ass so phat it’s my weakness",
  "Let me grip this thick cake",
  "What an ass let me claim daily",
  "Bitch built different sexy af",
  "Can I motorboat these balloons",
  "Tits so round I’m weak",
  "Balloon boobs alert everywhere fr",
  "Ass fat enough for days",
  "Let me hold them boobs tight",
  "What a juicy thick ass",
  "Bitch you got that body goals",
  "Can I get face buried deep",
  "Tits heavy af let me help",
  "Balloon boobs looking perfect fake",
  "Ass so fat I’d risk jail",
  "Let me smack that phatty hard",
  "What an ass I’m addicted fr",
  "Bitch you too sexy for words",
  "Can I get that cake clapped",
  "Tits bouncin got me gone",
  "Balloon boobs tryna hypnotize",
  "Ass fat af let me live in it",
  "Let me hold these while we go",
  "What a thick goddess body",
  "Bitch got me simping hard af",
  "Can I motorboat all night long",
  "Tits so big they own me",
  "Balloon boobs inflation maxed out",
  "Ass so phat it’s legendary af",
  "Let me grip that thick waist now",
  "What an ass let me own forever",
  "Bitch built for this life",
  "Can I get private motorboat session",
  "Tits perfect round handfuls",
  "Balloon boobs looking ready af",
  "Ass fat enough to feed nations",
  "Let me hold them melons daily",
  "What a phatty queen body",
  "Bitch you tryna ruin my focus",
  "Can I get that ass ride now",
  "Tits bouncin like paid entertainment",
  "Balloon boobs alert level 100",
  "Ass so juicy I’m obsessed",
  "Let me smack them cheeks red af",
  "What an ass I’d never leave it",
  "Bitch got that perfect slut build",
  "Can I get face full of cake",
  "Tits heavy let me carry the weight",
  "Balloon boobs too tempting fr",
  "Ass fat af let me clap it daily",
  "Let me hold these boobs while hitting",
  "What a thick ass goddess",
  "Bitch you got me feral completely",
  "Can I motorboat these heavy balloons",
  "Tits so round I stare forever",
  "Balloon boobs looking inflated perfect",
  "Ass so phat it’s my religion",
  "Let me grip this thick body hard",
  "What an ass let me worship it",
  "Bitch built like sin itself",
  "Can I get between them cheeks deep",
  "Tits perfect for playtime",
  "Balloon boobs alert max",
  "Ass fat enough to break records",
  "Let me hold them while you twerk",
  "What a juicy dumptruck phatty",
  "Bitch you too thick illegal af",
  "Can I get that cake smashed hard",
  "Tits bouncin got me hooked bad",
  "Balloon boobs tryna steal focus",
  "Ass so fat I’d quit life",
  "Let me smack that phat ass now",
  "What an ass I’m in love fr",
  "Bitch got that body rizz heavy",
  "Can I motorboat for hours straight",
  "Tits so big they need warning",
  "Balloon boobs looking fake but fire",
  "Ass fat af let me dive in",
  "Let me hold these melons tight",
  "What a phatty I’m addicted daily",
  "Bitch you perfect for virtual comments",
  "Can I get face buried in ass",
  "Tits heavy af let me support",
  "Balloon boobs inflation game strong",
  "Ass so juicy I’m thirsty forever",
  "Let me grip that thick cake",
  "What an ass let me claim it all",
  "Bitch built different thick af",
  "Can I get private access now",
  "Tits bouncin like they own me",
  "Balloon boobs alert everywhere",
  "Ass fat enough for everything",
  "Let me hold them boobs all night",
  "What a thick goddess body fr",
  "Bitch you got me paying bills",
  "Can I motorboat these balloons daily",
  "Tits so round perfect af",
  "Balloon boobs too big too hot",
  "Ass so phat it’s art fr",
  "Let me smack them cheeks hard",
  "What an ass I’d risk it all",
  "Bitch got that perfect thick build",
  "Can I get that ass clap session",
  "Tits heavy let me carry",
  "Balloon boobs looking ready to burst",
  "Ass fat af let me worship daily",
  "Let me hold these while we fuck",
  "What a juicy phatty queen",
  "Bitch you tryna get me banned fr",
  "Can I get face full of cake",
  "Tits bouncin got me weak af",
  "Balloon boobs alert level expert",
  "Ass so fat I’m obsessed forever",
  "Let me grip this thick body now",
  "What an ass let me own it",
  "Bitch built for sin completely",
  "Can I motorboat all night",
  "Tits perfect round af",
  "Balloon boobs tryna hypnotize me",
  "Ass fat enough to break internet",
  "Let me hold them melons tight",
  "What a phatty I’m in love",
  "Bitch you too sexy dangerous",
  "Can I get that cake clapped hard",
  "Tits so big they distract bad",
  "Balloon boobs looking inflated af",
  "Ass so phat it’s legendary",
  "Let me smack that phatty red",
  "What an ass let me dive deep",
  "Bitch got that body goals fr",
  "Can I get between them thighs",
  "Tits heavy af let me help",
  "Balloon boobs too tempting forever",
  "Ass fat af let me clap cheeks",
  "Let me hold these boobs while riding",
  "What a thick ass goddess",
  "Bitch you got me feral af",
  "Can I motorboat these heavy ones",
  "Tits so round I’m weak daily",
  "Balloon boobs alert maxed out",
  "Ass so juicy I’d quit everything",
  "Let me grip that thick waist hard",
  "What an ass I’m addicted fr",
  "Bitch built like a pornstar thick",
  "Can I get private motorboat",
  "Tits bouncin like paid",
  "Balloon boobs inflation game insane",
  "Ass fat enough for two hands",
  "Let me hold them while you move",
  "What a phatty queen body",
  "Bitch you tryna ruin lives",
  "Can I get that ass on my face",
  "Tits perfect for my hands fr",
  "Balloon boobs looking ready af",
  "Ass so fat I’d marry it",
  "Let me smack them cheeks now",
  "What an ass let me worship daily",
  "Bitch got that perfect slut look",
  "Can I get face buried deep",
  "Tits heavy let me carry",
  "Balloon boobs tryna escape",
  "Ass fat af let me live there",
  "Let me hold these melons forever",
  "What a juicy dumptruck",
  "Bitch you too thick for words",
  "Can I motorboat for life",
  "Tits so big they own the room",
  "Balloon boobs looking perfect",
  "Ass so phat it’s my weakness",
  "Let me grip this thick cake",
  "What an ass let me claim forever",
  "Bitch built different sexy",
  "Can I get that cake smashed",
  "Tits bouncin got me gone",
  "Balloon boobs alert level 100",
  "Ass fat af let me clap it",
  "Let me hold them boobs tight",
  "What a thick goddess fr",
  "Bitch you got me simping hard",
  "Can I get between them cheeks",
  "Tits so round I stare",
  "Balloon boobs too big hot",
  "Ass so juicy I’m obsessed",
  "Let me smack that phat ass",
  "What an ass I’d never leave",
  "Bitch got that body rizz",
  "Can I motorboat these balloons",
  "Tits heavy af let me support",
  "Balloon boobs inflation max",
  "Ass fat enough to feed",
  "Let me hold these while hitting",
  "What a phatty I’m in love fr",
  "Bitch you perfect for this",
  "Can I get private taste",
  "Tits bouncin like crazy",
  "Balloon boobs tryna pop",
  "Ass so phat it’s art",
  "Let me grip that thick body",
  "What an ass let me own daily",
  "Bitch built for sin af",
  "Can I get face full",
  "Tits perfect handfuls",
  "Balloon boobs alert everywhere",
  "Ass fat af let me dive",
  "Let me hold them melons now",
  "What a juicy thick ass",
  "Bitch you tryna get me feral",
  "Can I motorboat all day",
  "Tits so big warning label",
  "Balloon boobs looking fake fire",
  "Ass so fat I’d risk it",
  "Let me smack them cheeks",
  "What an ass I’m obsessed",
  "Bitch got that perfect build",
  "Can I get that ass ride",
  "Tits heavy let me carry",
  "Balloon boobs too tempting",
  "Ass fat af let me worship",
  "Let me hold these boobs forever",
  "What a phatty queen",
  "Bitch you too sexy",
  "Can I get cake clapped",
  "Tits bouncin got me hooked",
  "Balloon boobs alert max",
  "Ass so phat legendary",
  "Let me grip this thick",
  "What an ass let me claim",
  "Bitch built like goddess",
  "Can I motorboat heavy",
  "Tits round perfect",
  "Balloon boobs inflated",
  "Ass juicy obsessed",
  "Let me hold melons",
  "What a thick body",
  "Bitch got me paying",
  "Can I get face buried",
  "Tits so big own me",
  "Balloon boobs ready",
  "Ass fat clap",
  "Let me smack phatty",
  "What an ass worship",
  "Bitch slut material",
  "Can I get private",
  "Tits heavy support",
  "Balloon boobs escape",
  "Ass phat live",
  "Let me grip cake",
  "What a dumptruck",
  "Bitch thick illegal",
  "Can I motorboat life",
  "Tits bouncin weak",
  "Balloon boobs hypnotize",
  "Ass fat marry",
  "Let me hold tight",
  "What a phatty love",
  "Bitch ruin focus",
  "Can I get ride",
  "Tits perfect hands",
  "Balloon boobs pop",
  "Ass juicy quit",
  "Let me smack red",
  "What an ass dive",
  "Bitch rizz heavy",
  "Can I get cheeks",
  "Tits round stare",
  "Balloon boobs max",
  "Ass phat art",
  "Let me hold now",
  "What a goddess fr",
  "Bitch feral af",
  "Can I get deep",
  "Tits big distract",
  "Balloon boobs fire",
  "Ass fat risk",
  "Let me grip hard",
  "What an ass own",
  "Bitch sin completely",
  "Can I get full",
  "Tits handfuls fr",
  "Balloon boobs alert",
  "Ass enough everything",
  "Let me hold while",
  "What a queen body",
  "Bitch simping hard",
  "Can I get session",
  "Tits bouncin paid",
  "Balloon boobs insane",
  "Ass phat two",
  "Let me hold move",
  "What a dumptruck",
  "Bitch words thick",
  "Can I motorboat life",
  "Tits big room",
  "Balloon boobs perfect",
  "Ass phat weakness",
  "Let me grip cake",
  "What an ass claim",
  "Bitch sexy different",
  "Can I get smashed",
  "Tits gone bouncin",
  "Balloon boobs 100",
  "Ass af clap",
  "Let me hold tight",
  "What a fr goddess",
  "Bitch hard simping",
  "Can I get cheeks",
  "Tits support heavy",
  "Balloon boobs tempting",
  "Ass af worship",
  "Let me hold forever",
  "What a ass thick",
  "Bitch life ruin",
  "Can I get face",
  "Tits label warning",
  "Balloon boobs af ready",
  "Ass risk it",
  "Let me smack now",
  "What an worship ass",
  "Bitch material slut",
  "Can I get private",
  "Tits carry heavy",
  "Balloon boobs escape",
  "Ass live phat",
  "Let me grip body",
  "What a claim ass",
  "Bitch af sin",
  "Can I get buried",
  "Tits fr handfuls",
  "Balloon boobs everywhere",
  "Ass everything enough",
  "Let me hold now",
  "What a body queen",
  "Bitch hard simping",
  "Can I get session",
  "Tits paid bouncin",
  "Balloon boobs insane",
  "Ass two phat",
  "Let me hold move",
  "What a thick words",
  "Bitch life motorboat",
  "Tits room big",
  "Balloon boobs perfect",
  "Ass weakness phat",
  "Let me grip cake",
  "What an claim ass",
  "Bitch different sexy",
  "Can I get smashed",
  "Tits gone bouncin",
  "Balloon boobs 100",
  "Ass clap af",
  "Let me hold tight",
  "What a goddess fr",
  "Bitch hard simping",
  "Can I get cheeks",
  "Tits heavy support",
  "Balloon boobs tempting",
  "Ass worship af",
  "Let me hold forever",
  "What a thick ass",
  "Bitch ruin life",
  "Can I get face",
  "Tits warning big",
  "Balloon boobs ready af",
  "Ass risk it",
  "Let me smack now",
  "What an ass worship",
  "Bitch slut material",
  "Can I get private",
  "Tits heavy carry",
  "Balloon boobs escape",
  "Ass phat live",
  "Let me grip body",
  "What an ass claim",
  "Bitch sin af",
  "Can I get buried",
  "Tits handfuls fr",
  "Balloon boobs alert",
  "Ass enough everything",
  "Let me hold now",
  "What a queen body",
  "Bitch simping hard",
  "Can I get session",
  "Tits bouncin paid",
  "Balloon boobs insane",
  "Ass phat two",
  "Let me hold move",
  "What a dumptruck",
  "Bitch thick words",
  "Can I motorboat life",
  "Tits big room",
  "Balloon boobs perfect",
  "Ass phat weakness",
  "Let me grip cake",
  "What an ass claim",
  "Bitch sexy different",
  "Can I get smashed",
  "Tits gone bouncin",
  "Balloon boobs 100",
  "Ass af clap",
  "Let me hold tight",
  "What a goddess fr",
  "Bitch hard simping",
  "Can I get cheeks",
  "Tits support heavy",
  "Balloon boobs tempting",
  "Ass af worship",
  "Let me hold forever",
  "What a thick ass",
  "Bitch life ruin",
  "Can I get face",
  "Tits label warning",
  "Balloon boobs af ready",
  "Ass it risk",
  "Let me smack now",
  "What an worship ass",
  "Bitch material slut",
  "Can I get private",
  "Tits carry heavy",
  "Balloon boobs escape",
  "Ass live phat",
  "Let me grip body",
  "What an claim ass",
  "Bitch af sin",
  "Can I get buried",
  "Tits fr handfuls",
  "Balloon boobs everywhere",
  "Ass everything enough",
  "Let me hold now",
  "What a body queen",
  "Bitch hard simping",
  "Can I get session",
  "Tits paid bouncin",
  "Balloon boobs insane",
  "Ass two phat",
  "Let me hold move",
  "What a thick words",
  "Bitch life motorboat",
  "Tits room big",
  "Balloon boobs perfect",
  "Ass weakness phat",
  "Let me grip cake",
  "What an claim ass",
  "Bitch different sexy",
  "Can I get smashed",
  "Tits gone bouncin",
  "Balloon boobs 100",
  "Ass clap af",
  "Let me hold tight",
  "What a goddess fr",
  "Bitch hard simping",
  "Can I get cheeks",
  "Tits heavy support",
  "Balloon boobs tempting",
  "Ass worship af",
  "Let me hold forever",
  "What a thick ass",
  "Bitch ruin life",
  "Can I get face",
  "Tits warning big",
  "Balloon boobs ready af",
  "Ass risk it",
  "Let me smack now",
  "What an ass worship",
  "Bitch slut material",
  "Can I get private",
  "Tits heavy carry",
  "Balloon boobs escape",
  "Ass phat live",
  "Let me grip body",
  "What an ass claim",
  "Bitch sin af",
  "Can I get buried",
  "Tits handfuls fr",
  "Balloon boobs alert",
  "Ass enough everything",
  "Let me hold now",
  "What a queen body",
  "Bitch simping hard",
  "Can I get session",
  "Tits bouncin paid",
  "Balloon boobs insane",
  "Ass phat two",
  "Let me hold move",
  "What a dumptruck",
  "Bitch thick words",
  "Can I motorboat life",
  "Tits big room",
  "Balloon boobs perfect",
  "Ass phat weakness",
  "Let me grip cake",
  "What an"
];

const RANDOM_USERNAMES = [
  "baddie_99", "thicc.lover", "gymbro_x", "simp_nation", "peach.inspector",
  "cake.boss", "melon.man", "gyat.hunter", "booty.critic", "titty.fanatic",
  "ass.man.420", "thick.thighs.save.lives", "motorboat.king", "clap.cheeks.daily",
  "simp.for.her", "goddess.worshipper", "phatty.lover", "dumptruck.driver",
  "cake.eater", "melon.squeezer"
];

const MediaLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/10 backdrop-blur-[2px] z-10">
    <div className="w-8 h-8 border-2 border-zinc-500 border-t-white rounded-full animate-spin" />
  </div>
);

const GridItem: React.FC<{ post: Post, onPostClick?: (id: string) => void }> = ({ post, onPostClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  return (
    <div 
      className="aspect-square relative group cursor-pointer bg-zinc-900"
      onClick={() => onPostClick?.(post.id)}
    >
      {isLoading && !hasError && <MediaLoader />}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-20">
          <AlertCircle size={16} className="text-red-500/50 mb-1" />
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setHasError(false);
              setIsLoading(true);
            }}
            className="text-[8px] text-white font-bold bg-zinc-800 px-2 py-0.5 rounded"
          >
            Retry
          </button>
        </div>
      )}
      <img 
        src={post.imageUrl} 
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
        onLoad={() => { setIsLoading(false); setHasError(false); }}
        onError={() => { setIsLoading(false); setHasError(true); }}
      />
      {post.type === 'video' && (
        <div className="absolute top-1 right-1">
          <Video size={14} className="text-white fill-white" />
        </div>
      )}
    </div>
  );
};

const SearchGridItem: React.FC<{ post: Post, index: number, onClick: () => void }> = ({ post, index, onClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  return (
    <div 
      className={`relative cursor-pointer overflow-hidden bg-zinc-900 ${index % 7 === 0 ? 'row-span-2 col-span-2' : ''}`}
      onClick={onClick}
    >
      {isLoading && !hasError && <MediaLoader />}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-20">
          <AlertCircle size={24} className="text-red-500/50 mb-2" />
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setHasError(false);
              setIsLoading(true);
            }}
            className="text-[10px] text-white font-bold bg-zinc-800 px-3 py-1 rounded"
          >
            Retry
          </button>
        </div>
      )}
      <img 
        src={post.imageUrl} 
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
        onLoad={() => { setIsLoading(false); setHasError(false); }}
        onError={() => { setIsLoading(false); setHasError(true); }}
      />
    </div>
  );
};

const DiscoverPeople: React.FC<{ 
  profiles: Profile[], 
  myProfile: Profile,
  onToggleFollow: (id: string) => void,
  onProfileClick: (id: string) => void,
  onSeeAll: () => void
}> = ({ profiles, myProfile, onToggleFollow, onProfileClick, onSeeAll }) => {
  return (
    <div className="py-4 border-b border-zinc-900">
      <div className="flex items-center justify-between px-4 mb-3">
        <span className="text-sm font-bold">Discover people</span>
        <button 
          onClick={onSeeAll}
          className="text-blue-500 text-xs font-bold"
        >
          See All
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 scrollbar-hide">
        {profiles.map(profile => {
          const isFollowing = myProfile.followingIds?.includes(profile.id);
          return (
            <div 
              key={profile.id}
              className="flex-shrink-0 w-[160px] bg-black border border-zinc-800 rounded-lg p-4 flex flex-col items-center text-center relative"
            >
              <button 
                className="absolute top-2 right-2 text-zinc-500"
                onClick={(e) => { e.stopPropagation(); }}
              >
                <X size={16} />
              </button>
              <div 
                className="w-24 h-24 rounded-full overflow-hidden mb-3 cursor-pointer"
                onClick={() => onProfileClick(profile.id)}
              >
                <img 
                  src={profile.profilePic || `https://picsum.photos/seed/${profile.id}/200`} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex items-center gap-1 mb-0.5 w-full justify-center">
                <span className="text-xs font-bold truncate max-w-[120px]">{profile.username}</span>
                {profile.isVerified && <CheckCircle2 size={12} className="text-blue-500 fill-blue-500 text-white" />}
              </div>
              <p className="text-[10px] text-zinc-500 mb-4 truncate w-full">{profile.fullName}</p>
              <button 
                onClick={() => onToggleFollow(profile.id)}
                className={`w-full py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  isFollowing ? 'bg-zinc-900 text-white border border-zinc-800' : 'bg-blue-500 text-white'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface PostItemProps {
  post: Post;
  profile?: Profile;
  onToggleLike: () => void;
  onProfileClick: (id: string) => void;
  onPostClick?: (id: string) => void;
  onCommentClick?: (id: string) => void;
  isGalleryMode?: boolean;
}

const PostItem: React.FC<PostItemProps> = ({ post, profile, onToggleLike, onProfileClick, onPostClick, onCommentClick, isGalleryMode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showHeart, setShowHeart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (post.type !== 'video' || !videoRef.current || isGalleryMode) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [post.type, isGalleryMode]);

  const handleDoubleClick = () => {
    if (isGalleryMode) {
      if (zoom > 1) {
        setZoom(1);
        setOffset({ x: 0, y: 0 });
      } else {
        setZoom(2.5);
      }
    } else {
      if (!post.isLiked) {
        onToggleLike();
      }
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 1000);
    }
  };

  const handleDrag = (event: any, info: any) => {
    if (zoom > 1 && info?.delta) {
      setOffset({
        x: offset.x + info.delta.x,
        y: offset.y + info.delta.y
      });
    }
  };

  return (
    <div className="border-b border-zinc-900 pb-4">
      <div className="flex items-center justify-between px-4 py-3">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onProfileClick(post.profileId)}
        >
          <img 
            src={profile?.profilePic || `https://picsum.photos/seed/${post.profileId}/200`} 
            className="w-8 h-8 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="flex items-center gap-1">
            <span className="font-bold text-sm">{profile?.username || 'Unknown'}</span>
            {profile?.isVerified && <CheckCircle2 size={14} className="text-blue-500 fill-blue-500 text-white" />}
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-zinc-900 rounded-full transition-colors"
          >
            <MoreHorizontal size={20} className="text-zinc-400" />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowMenu(false)} 
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  <button 
                    onClick={() => {
                      setShowFullscreen(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-white hover:bg-zinc-800 flex items-center gap-3 font-medium"
                  >
                    <Maximize2 size={18} />
                    Full View
                  </button>
                  {post.type === 'video' && (
                    <button 
                      onClick={() => {
                        setIsMuted(!isMuted);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-white hover:bg-zinc-800 flex items-center gap-3 font-medium"
                    >
                      {isMuted ? <Volume2 size={18} /> : <VolumeX size={18} />}
                      {isMuted ? 'Unmute' : 'Mute'}
                    </button>
                  )}
                  <button 
                    className="w-full px-4 py-3 text-left text-sm text-white hover:bg-zinc-800 flex items-center gap-3 font-medium"
                    onClick={() => setShowMenu(false)}
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                  <button 
                    className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-zinc-800 flex items-center gap-3 font-medium"
                    onClick={() => setShowMenu(false)}
                  >
                    <AlertCircle size={18} />
                    Report
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div 
        className={`relative overflow-hidden bg-zinc-950 ${zoom > 1 ? 'touch-none' : ''}`} 
        onDoubleClick={handleDoubleClick} 
        onClick={() => !isGalleryMode && onPostClick?.(post.id)}
      >
        {isMediaLoading && !hasError && <MediaLoader />}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 p-6 text-center z-20">
            <AlertCircle size={32} className="text-red-500 mb-2" />
            <p className="text-[10px] text-zinc-400 mb-3">Failed to load media. Check link permissions.</p>
            <button 
              onClick={(e) => { 
                e.stopPropagation();
                setHasError(false); 
                setIsMediaLoading(true); 
              }}
              className="bg-white text-black px-4 py-1.5 rounded-full text-[10px] font-bold hover:bg-gray-200 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
        <motion.div
          drag={zoom > 1}
          dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
          dragElastic={0.1}
          onDrag={handleDrag}
          animate={{ scale: zoom, x: offset.x, y: offset.y }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`w-full flex items-center justify-center ${isMediaLoading ? 'aspect-square' : ''}`}
        >
          {post.type === 'video' ? (
            <div className="relative w-full h-full">
              <video 
                ref={videoRef}
                src={post.videoUrl} 
                className="w-full h-auto block"
                muted={isMuted} 
                loop 
                playsInline
                preload="metadata"
                crossOrigin="anonymous"
                onLoadedData={() => { setIsMediaLoading(false); setHasError(false); }}
                onWaiting={() => setIsMediaLoading(true)}
                onPlaying={() => setIsMediaLoading(false)}
                onError={() => { setIsMediaLoading(false); setHasError(true); }}
                referrerPolicy="no-referrer"
              />
              {!isGalleryMode && (
                <div className="absolute top-3 right-3 bg-black/50 p-1.5 rounded-full pointer-events-none">
                  <Video size={16} className="text-white" />
                </div>
              )}
            </div>
          ) : (
            <img 
              src={post.imageUrl} 
              className="w-full h-auto block"
              referrerPolicy="no-referrer"
              onLoad={() => { setIsMediaLoading(false); setHasError(false); }}
              onError={() => { setIsMediaLoading(false); setHasError(true); }}
            />
          )}
        </motion.div>
        <AnimatePresence>
          {showHeart && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Heart size={80} className="text-white fill-white drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showFullscreen && (
            <FullscreenImageViewer 
              post={post} 
              onClose={() => setShowFullscreen(false)} 
            />
          )}
        </AnimatePresence>
      </div>
      <div className="px-4 py-3">
        <div className="flex items-center gap-4 mb-2">
          <Heart 
            size={24} 
            className={`cursor-pointer transition-colors ${post.isLiked ? 'text-red-500 fill-red-500' : ''}`}
            onClick={onToggleLike}
          />
          <MessageCircle size={24} className="cursor-pointer" onClick={() => onCommentClick?.(post.id)} />
          <Send size={24} className="cursor-pointer" />
        </div>
        <p className="font-bold text-sm mb-1">{post.likes.toLocaleString()} likes</p>
        <p className="text-sm">
          <span className="font-bold mr-2">{profile?.username}</span>
          {post.caption}
        </p>
        {post.comments && post.comments.length > 0 && (
          <p 
            className="text-sm text-zinc-500 mt-1 cursor-pointer"
            onClick={() => onCommentClick?.(post.id)}
          >
            View all {post.comments.length} comments
          </p>
        )}
        <p className="text-[10px] text-zinc-500 uppercase mt-2">{new Date(post.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

function PostGallery({ 
  posts, 
  initialPostId, 
  profiles, 
  onClose, 
  onToggleLike, 
  onProfileClick,
  onCommentClick
}: { 
  posts: Post[], 
  initialPostId: string, 
  profiles: Profile[], 
  onClose: () => void, 
  onToggleLike: (id: string) => void, 
  onProfileClick: (id: string) => void,
  onCommentClick: (id: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = document.getElementById(`gallery-post-${initialPostId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'auto' });
    }
  }, [initialPostId]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-900 bg-black sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <ChevronLeft size={28} className="cursor-pointer" onClick={onClose} />
          <h2 className="text-lg font-bold">Posts</h2>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="max-w-md mx-auto">
          {posts.map((post) => (
            <div key={post.id} id={`gallery-post-${post.id}`} className="mb-8">
              <PostItem 
                post={post} 
                profile={profiles.find(p => p.id === post.profileId)}
                onToggleLike={() => onToggleLike(post.id)}
                onProfileClick={onProfileClick}
                onCommentClick={onCommentClick}
                isGalleryMode
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function FullscreenImageViewer({ 
  post, 
  onClose 
}: { 
  post: Post, 
  onClose: () => void 
}) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastTouchRef = useRef<{ x: number, y: number } | null>(null);
  const lastDistanceRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastDistanceRef.current = distance;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && zoom > 1) {
      const touch = e.touches[0];
      if (lastTouchRef.current) {
        const dx = touch.clientX - lastTouchRef.current.x;
        const dy = touch.clientY - lastTouchRef.current.y;
        setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      }
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
    } else if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (lastDistanceRef.current) {
        const delta = distance / lastDistanceRef.current;
        setZoom(prev => Math.min(Math.max(prev * delta, 1), 5));
      }
      lastDistanceRef.current = distance;
    }
  };

  const handleTouchEnd = () => {
    lastTouchRef.current = null;
    lastDistanceRef.current = null;
    if (zoom === 1) {
      setOffset({ x: 0, y: 0 });
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    } else {
      setZoom(2.5);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.min(Math.max(prev * delta, 1), 5));
    if (zoom === 1) setOffset({ x: 0, y: 0 });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-50 bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ChevronLeft size={32} className="text-white" />
        </button>
        <div className="text-white font-bold text-sm uppercase tracking-widest opacity-50">
          Full View
        </div>
        <div className="w-10" />
      </div>

      <div 
        className={`flex-1 flex items-center justify-center overflow-hidden ${zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
        onDoubleClick={handleDoubleClick}
      >
        <motion.div
          animate={{ scale: zoom, x: offset.x, y: offset.y }}
          transition={isDragging ? { type: 'just' } : { type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full h-full flex items-center justify-center"
        >
          {post.type === 'video' ? (
            <video 
              src={post.videoUrl} 
              className="max-w-full max-h-full object-contain"
              autoPlay 
              muted 
              loop 
              playsInline
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          ) : (
            <img 
              src={post.imageUrl} 
              className="max-w-full max-h-full object-contain"
              referrerPolicy="no-referrer"
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

const ShareSheet: React.FC<{ 
  post: Post, 
  onClose: () => void 
}> = ({ post, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      const url = post.videoUrl || post.imageUrl;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleDownload = async () => {
    try {
      const url = post.videoUrl || post.imageUrl;
      let blob;
      
      // Try cache first for reliability and offline support
      try {
        const cache = await caches.open('intragram-v2');
        const cachedResponse = await cache.match(url);
        if (cachedResponse) {
          blob = await cachedResponse.blob();
        }
      } catch (cacheErr) {
        console.warn('Cache access failed during download:', cacheErr);
      }

      if (!blob) {
        // Fallback to fetch with better security handling
        const response = await fetch(url, { mode: 'cors' });
        if (!response.ok) throw new Error('Fetch failed');
        blob = await response.blob();
      }

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `intragram-${post.id}-${Date.now()}.${post.videoUrl ? 'mp4' : 'jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed:', err);
      // Last resort: open in new tab
      window.open(post.videoUrl || post.imageUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-zinc-900 rounded-t-3xl overflow-hidden pb-10"
      >
        <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto my-3" />
        
        <div className="px-6 py-4">
          <h3 className="text-center font-bold mb-6">Share</h3>
          
          <div className="grid grid-cols-4 gap-4 mb-8">
            <button 
              onClick={handleCopyLink}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors">
                {copied ? <CheckCircle2 size={24} className="text-green-500" /> : <Link size={24} />}
              </div>
              <span className="text-[10px] font-medium text-zinc-400">{copied ? 'Copied!' : 'Copy link'}</span>
            </button>
            
            <button 
              onClick={handleDownload}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors">
                <Download size={24} />
              </div>
              <span className="text-[10px] font-medium text-zinc-400">Download</span>
            </button>

            <button className="flex flex-col items-center gap-2 opacity-50 cursor-not-allowed">
              <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center">
                <Share2 size={24} />
              </div>
              <span className="text-[10px] font-medium text-zinc-400">Share to...</span>
            </button>

            <button className="flex flex-col items-center gap-2 opacity-50 cursor-not-allowed">
              <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center">
                <MoreHorizontal size={24} />
              </div>
              <span className="text-[10px] font-medium text-zinc-400">More</span>
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Suggested</p>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0 opacity-40">
                  <div className="w-14 h-14 bg-zinc-800 rounded-full overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/100`} className="w-full h-full object-cover grayscale" />
                  </div>
                  <span className="text-[10px] text-zinc-500">User {i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ReelItem: React.FC<{ 
  post: Post, 
  profile?: Profile, 
  onToggleLike: () => void, 
  onProfileClick: (id: string) => void,
  onCommentClick?: (id: string) => void,
  isMuted: boolean,
  setIsMuted: (muted: boolean) => void,
  isActive: boolean,
  shouldLoad: boolean
}> = ({ 
  post, 
  profile, 
  onToggleLike, 
  onProfileClick,
  onCommentClick,
  isMuted,
  setIsMuted,
  isActive,
  shouldLoad
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showHeart, setShowHeart] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (!isActive && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isActive, shouldLoad]);

  const handleDoubleClick = () => {
    if (!post.isLiked) {
      onToggleLike();
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1000);
  };

  return (
    <div className="relative h-full w-full bg-black snap-always snap-start overflow-hidden group">
      {isMediaLoading && shouldLoad && !hasError && <MediaLoader />}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 p-10 text-center z-20">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <p className="text-sm text-zinc-400 mb-6">Failed to load video. Ensure the link is a direct .mp4 file.</p>
          <button 
            onClick={(e) => { 
              e.stopPropagation();
              setHasError(false); 
              setIsMediaLoading(true); 
            }}
            className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
      
      {shouldLoad ? (
        <video
          ref={videoRef}
          src={post.videoUrl}
          className="h-full w-full object-cover"
          loop
          muted={isMuted}
          playsInline
          crossOrigin="anonymous"
          onDoubleClick={handleDoubleClick}
          onLoadedData={() => { setIsMediaLoading(false); setHasError(false); }}
          onWaiting={() => setIsMediaLoading(true)}
          onPlaying={() => setIsMediaLoading(false)}
          onError={() => { setIsMediaLoading(false); setHasError(true); }}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="h-full w-full bg-zinc-900" />
      )}
      
      {/* Heart Animation */}
      <AnimatePresence>
        {showHeart && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <Heart size={100} className="text-white fill-white drop-shadow-lg" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent pb-16">
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick={() => onProfileClick(post.profileId)}>
              <img 
                src={profile?.profilePic} 
                className="w-8 h-8 rounded-full border border-white/20"
                referrerPolicy="no-referrer"
              />
              <span className="font-bold text-sm text-white">{profile?.username}</span>
              {profile?.isVerified && <CheckCircle2 size={14} className="text-blue-500 fill-blue-500 text-white" />}
              <button className="ml-2 border border-white/40 px-2 py-0.5 rounded text-[10px] font-bold text-white">Follow</button>
            </div>
            <p className="text-sm text-white line-clamp-2 mb-3">{post.caption}</p>
            <div className="flex items-center gap-2 text-white/80">
              <Music size={14} />
              <span className="text-xs truncate">Original Audio • {profile?.username}</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-5 pb-4 relative">
            <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={onToggleLike}>
              <Heart size={28} className={post.isLiked ? "text-red-500 fill-red-500" : "text-white"} />
              <span className="text-xs text-white font-medium">{formatNumber(post.likes)}</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => onCommentClick?.(post.id)}>
              <MessageCircle size={28} className="text-white" />
              <span className="text-xs text-white font-medium">{formatNumber(post.comments?.length || 0)}</span>
            </div>
            <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setShowShareSheet(true)}>
              <Send size={28} className="text-white" />
            </div>
            <div className="cursor-pointer relative" onClick={() => setShowMenu(!showMenu)}>
              <MoreVertical size={24} className="text-white" />
              {showMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-32 bg-zinc-800 rounded-xl overflow-hidden shadow-xl z-50">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-white hover:bg-zinc-700 flex items-center gap-2"
                  >
                    {isMuted ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    {isMuted ? 'Unmute' : 'Mute'}
                  </button>
                </div>
              )}
            </div>
            <div className="w-8 h-8 rounded border-2 border-white overflow-hidden mt-2">
              <img src={profile?.profilePic} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showShareSheet && (
          <ShareSheet 
            post={post} 
            onClose={() => setShowShareSheet(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SeeAllSuggested({ 
  profiles, 
  myProfile, 
  onToggleFollow, 
  onProfileClick, 
  onBack 
}: { 
  profiles: Profile[], 
  myProfile: Profile, 
  onToggleFollow: (id: string) => void, 
  onProfileClick: (id: string) => void,
  onBack: () => void
}) {
  return (
    <div className="flex flex-col h-full bg-black">
      <div className="px-4 py-4 flex items-center gap-4 border-b border-zinc-900 sticky top-0 z-10 bg-black">
        <ChevronLeft size={28} className="cursor-pointer" onClick={onBack} />
        <h2 className="text-lg font-bold">Discover people</h2>
      </div>
      <div className="p-4 space-y-6 overflow-y-auto">
        {profiles.map(profile => {
          const isFollowing = myProfile.followingIds?.includes(profile.id);
          return (
            <div key={profile.id} className="flex items-center justify-between">
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => onProfileClick(profile.id)}
              >
                <img 
                  src={profile.profilePic || `https://picsum.photos/seed/${profile.id}/200`} 
                  className="w-12 h-12 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm">{profile.username}</span>
                    {profile.isVerified && <CheckCircle2 size={14} className="text-blue-500 fill-blue-500 text-white" />}
                  </div>
                  <p className="text-xs text-zinc-500">{profile.fullName}</p>
                </div>
              </div>
              <button 
                onClick={() => onToggleFollow(profile.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
                  isFollowing ? 'bg-zinc-900 text-white border border-zinc-800' : 'bg-blue-500 text-white'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ReelsView: React.FC<{ 
  posts: Post[], 
  profiles: Profile[], 
  onToggleLike: (id: string) => void, 
  onProfileClick: (id: string) => void,
  onCommentClick: (id: string) => void
}> = ({ 
  posts, 
  profiles, 
  onToggleLike, 
  onProfileClick,
  onCommentClick
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const videoPosts = useMemo(() => {
    return posts.filter(p => p.type === 'video').sort(() => Math.random() - 0.5);
  }, [posts]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const index = Math.round(container.scrollTop / container.clientHeight);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  if (videoPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black text-white p-10 text-center">
        <Video size={48} className="text-zinc-700 mb-4" />
        <h3 className="font-bold text-lg mb-2">No reels yet</h3>
        <p className="text-zinc-500 text-sm">Upload some video posts to see them here.</p>
      </div>
    );
  }

  return (
    <div 
      className="h-full w-full bg-black overflow-y-auto snap-y snap-mandatory scrollbar-hide"
      onScroll={handleScroll}
    >
      {videoPosts.map((post, index) => (
        <ReelItem 
          key={post.id} 
          post={post} 
          profile={profiles.find(p => p.id === post.profileId)}
          onToggleLike={() => onToggleLike(post.id)}
          onProfileClick={onProfileClick}
          onCommentClick={onCommentClick}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          isActive={index === activeIndex}
          shouldLoad={Math.abs(index - activeIndex) <= 1}
        />
      ))}
    </div>
  );
}

function ChatView({ 
  conversation, 
  profile, 
  onBack, 
  onSendMessage,
  onDeleteChat
}: { 
  conversation: Conversation, 
  profile: Profile, 
  onBack: () => void, 
  onSendMessage: (text: string) => void,
  onDeleteChat: (id: string) => void
}) {
  const [message, setMessage] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900 sticky top-0 bg-black z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 hover:bg-zinc-900 rounded-full">
            <ChevronLeft size={28} />
          </button>
          <div className="flex items-center gap-3">
            <img 
              src={profile.profilePic || `https://picsum.photos/seed/${profile.id}/200`} 
              className="w-8 h-8 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="font-bold text-sm">{profile.username}</p>
              <p className="text-[10px] text-zinc-500">Active now</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-1 hover:bg-zinc-900 rounded-full">
            <Phone size={24} className="text-white" />
          </button>
          <button className="p-1 hover:bg-zinc-900 rounded-full">
            <Video size={26} className="text-white" />
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-zinc-900 rounded-full"
            >
              <MoreVertical size={24} className="text-white" />
            </button>
            
            <AnimatePresence>
              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowMenu(false)} 
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <button 
                      onClick={() => {
                        if (window.confirm('Delete this chat? This will remove all messages.')) {
                          onDeleteChat(conversation.id);
                        }
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-zinc-800 flex items-center gap-3 font-medium"
                    >
                      <Trash2 size={18} />
                      Delete Chat
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {conversation.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
              <MessageCircle size={40} className="text-zinc-700" />
            </div>
            <h3 className="font-bold text-lg mb-1">No messages yet</h3>
            <p className="text-zinc-500 text-sm max-w-[200px]">Send a message to start a conversation with @{profile.username}</p>
          </div>
        ) : (
          conversation.messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                  msg.senderId === 'me' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-zinc-800 text-white rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-900">
        <div className="flex items-center gap-3 bg-zinc-900 rounded-full px-4 py-2">
          <Camera size={24} className="text-zinc-400" />
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message..."
            className="flex-1 bg-transparent border-none outline-none text-sm py-1"
          />
          {message.trim() ? (
            <button type="submit" className="text-blue-500 font-bold text-sm">Send</button>
          ) : (
            <div className="flex gap-3">
              <ImageIcon size={24} className="text-zinc-400" />
              <Heart size={24} className="text-zinc-400" />
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

function MessagesView({ 
  profiles, 
  conversations, 
  onBack, 
  onSelectConversation,
  onStartNewConversation,
  onDeleteConversation
}: { 
  profiles: Profile[], 
  conversations: Conversation[], 
  onBack: () => void,
  onSelectConversation: (id: string) => void,
  onStartNewConversation: (profileId: string) => void,
  onDeleteConversation: (id: string) => void
}) {
  const [search, setSearch] = useState('');
  
  const filteredProfiles = profiles.filter(p => 
    p.username.toLowerCase().includes(search.toLowerCase()) || 
    p.fullName.toLowerCase().includes(search.toLowerCase())
  );

  // Only show conversations that have at least one message
  const activeConversations = conversations.filter(conv => conv.messages.length > 0);

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900 sticky top-0 bg-black z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-1 hover:bg-zinc-900 rounded-full">
            <ChevronLeft size={28} />
          </button>
          <h2 className="text-xl font-bold tracking-tight">Messages</h2>
        </div>
        <PlusSquare size={24} className="cursor-pointer" />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-4">
          <div className="flex items-center gap-3 bg-zinc-900 rounded-xl px-4 py-2 mb-6">
            <Search size={18} className="text-zinc-500" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent border-none outline-none text-sm py-1"
            />
          </div>

          {search ? (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-2">Profiles</h3>
              {filteredProfiles.length === 0 ? (
                <p className="text-zinc-500 text-sm px-2">No profiles found</p>
              ) : (
                filteredProfiles.map(p => (
                  <div 
                    key={p.id} 
                    className="flex items-center gap-3 p-2 hover:bg-zinc-900 rounded-xl cursor-pointer"
                    onClick={() => onStartNewConversation(p.id)}
                  >
                    <img 
                      src={p.profilePic || `https://picsum.photos/seed/${p.id}/200`} 
                      className="w-12 h-12 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="font-bold text-sm">{p.username}</p>
                      <p className="text-xs text-zinc-500">{p.fullName}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {activeConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                    <Send size={40} className="text-zinc-700" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">No messages sent</h3>
                  <p className="text-zinc-500 text-sm max-w-[200px]">Send private photos and messages to a friend.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2 mb-4">
                    <h3 className="font-bold">Messages</h3>
                    <button className="text-blue-500 text-sm font-bold">Requests</button>
                  </div>
                  {activeConversations.map(conv => {
                    const profile = profiles.find(p => p.id === conv.profileId);
                    if (!profile) return null;
                    return (
                      <div 
                        key={conv.id} 
                        className="flex items-center gap-3 p-2 hover:bg-zinc-900 rounded-xl cursor-pointer group"
                        onClick={() => onSelectConversation(conv.id)}
                      >
                        <img 
                          src={profile.profilePic || `https://picsum.photos/seed/${profile.id}/200`} 
                          className="w-14 h-14 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm">{profile.username}</p>
                          <div className="flex items-center gap-1">
                            <p className="text-xs text-zinc-500 truncate">{conv.lastMessage || 'Sent a message'}</p>
                            <span className="text-[10px] text-zinc-600">•</span>
                            <span className="text-[10px] text-zinc-600">1h</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteConversation(conv.id);
                            }}
                            className="p-2 text-zinc-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={18} />
                          </button>
                          <Camera size={20} className="text-zinc-500" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-2">Suggestions</h3>
                <div className="space-y-2">
                  {profiles.slice(0, 12).map(p => (
                    <div 
                      key={p.id} 
                      className="flex items-center justify-between p-2 hover:bg-zinc-900 rounded-xl cursor-pointer"
                      onClick={() => onStartNewConversation(p.id)}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={p.profilePic || `https://picsum.photos/seed/${p.id}/200`} 
                          className="w-12 h-12 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-sm">{p.username}</p>
                          <p className="text-xs text-zinc-500">{p.fullName}</p>
                        </div>
                      </div>
                      <button className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold">Message</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Error Boundary Component
export class ErrorBoundary extends Component<any, any> {
  constructor(props: any) {
    super(props);
    (this as any).state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if ((this as any).state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white p-6 text-center">
          <h2 className="text-xl font-bold mb-4">Something went wrong.</h2>
          <p className="text-zinc-500 mb-6">We're sorry for the inconvenience. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-white text-black px-6 py-2 rounded-full font-bold"
          >
            Refresh App
          </button>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [myProfile, setMyProfile] = useState<Profile>({
    id: 'me',
    username: 'your_username',
    fullName: 'Your Name',
    bio: 'Welcome to your Intragram profile!',
    profilePic: '',
    followers: 0,
    following: 0,
    isVerified: false,
    postsCount: 0,
    followingIds: []
  });
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'search' | 'settings' | 'my-profile' | 'reels' | 'messages'>('home');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSeeAllSuggested, setShowSeeAllSuggested] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [galleryPosts, setGalleryPosts] = useState<Post[]>([]);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    // Check if in iframe
    try {
      if (window.self !== window.top) {
        setIsInIframe(true);
      }
    } catch (e) {
      setIsInIframe(true);
    }
    
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsAppInstalled(true);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Comments State
  const [randomCommentCount, setRandomCommentCount] = useState(5);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // PWA Install Prompt
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const installApp = async () => {
    if (isInIframe) {
      alert("App installation is blocked inside this preview frame. Please open the app in a new tab first.");
      window.open(window.location.href, '_blank');
      return;
    }
    
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsAppInstalled(true);
      }
    } else {
      // If no prompt, check if we can trigger manual instruction or show the browser native dialog
      if (isAppInstalled) {
        alert("The app is already installed on your device!");
      } else {
        alert("To install Intragram Native App:\n\n1. On Android: Tap the three dots (⋮) in Chrome and select 'Install app'.\n2. On iPhone: Tap the Share icon in Safari and select 'Add to Home Screen'.");
      }
    }
  };

  const saveData = async (dataToSave: any) => {
    try {
      await set(STORAGE_KEY, dataToSave);
    } catch (e) {
      console.error("Failed to save data locally", e);
    }
  };

  // Load data from IndexedDB
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await get(STORAGE_KEY);
        if (savedData) {
          setProfiles(savedData.profiles || []);
          const migratedPosts = (savedData.posts || []).map((p: any) => ({
            ...p,
            type: p.type || 'image'
          }));
          setPosts(migratedPosts);
          if (savedData.myProfile) setMyProfile(savedData.myProfile);
          if (savedData.conversations) setConversations(savedData.conversations);
        }
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Save data to localStorage (idb) with debouncing
  useEffect(() => {
    if (isLoading) return;

    const timeoutId = setTimeout(async () => {
      const dataToSave = { profiles, posts, myProfile, conversations };
      await saveData(dataToSave);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [profiles, posts, myProfile, conversations, isLoading]);

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const addProfile = (profile: Profile) => {
    setProfiles([...profiles, profile]);
  };

  const updateProfile = (updatedProfile: Profile) => {
    setProfiles(profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p));
  };

  const deleteProfile = (id: string) => {
    setProfiles(profiles.filter(p => p.id !== id));
    setPosts(posts.filter(p => p.profileId !== id));
    if (selectedProfileId === id) setSelectedProfileId(null);
  };

  const generateRandomComments = (count: number) => {
    const comments = [];
    for (let i = 0; i < count; i++) {
      const randomText = RANDOM_COMMENTS[Math.floor(Math.random() * RANDOM_COMMENTS.length)];
      const randomUsername = RANDOM_USERNAMES[Math.floor(Math.random() * RANDOM_USERNAMES.length)];
      comments.push({
        id: Math.random().toString(36).slice(2, 11),
        username: randomUsername,
        profilePic: `https://picsum.photos/seed/${randomUsername}/100`,
        text: randomText,
        createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        likes: Math.floor(Math.random() * 50),
        isLiked: false
      });
    }
    return comments;
  };

  const addPost = (post: Post) => {
    const postWithComments = {
      ...post,
      comments: post.comments || generateRandomComments(randomCommentCount)
    };
    setPosts([postWithComments, ...posts]);
    // Update post count for profile
    const profile = profiles.find(p => p.id === post.profileId);
    if (profile) {
      updateProfile({ ...profile, postsCount: (profile.postsCount || 0) + 1 });
    }
  };

  const deletePost = (id: string) => {
    const postToDelete = posts.find(p => p.id === id);
    setPosts(posts.filter(p => p.id !== id));
    if (postToDelete) {
      const profile = profiles.find(p => p.id === postToDelete.profileId);
      if (profile) {
        updateProfile({ ...profile, postsCount: Math.max(0, (profile.postsCount || 0) - 1) });
      }
    }
  };

  const updatePost = (updatedPost: Post) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = !post.isLiked;
        return {
          ...post,
          isLiked,
          likes: isLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  const toggleFollow = (profileId: string) => {
    const isFollowing = myProfile.followingIds?.includes(profileId);
    let newFollowingIds = [...(myProfile.followingIds || [])];
    
    if (isFollowing) {
      newFollowingIds = newFollowingIds.filter(id => id !== profileId);
    } else {
      newFollowingIds.push(profileId);
    }

    setMyProfile({
      ...myProfile,
      followingIds: newFollowingIds,
      following: newFollowingIds.length
    });

    // Update the target profile's follower count
    setProfiles(profiles.map(p => {
      if (p.id === profileId) {
        return {
          ...p,
          followers: isFollowing ? p.followers - 1 : p.followers + 1
        };
      }
      return p;
    }));
  };

  const startNewConversation = (profileId: string) => {
    const existing = conversations.find(c => c.profileId === profileId);
    if (existing) {
      setSelectedConversationId(existing.id);
    } else {
      const newConv: Conversation = {
        id: Math.random().toString(36).substr(2, 9),
        profileId,
        messages: []
      };
      setConversations([newConv, ...conversations]);
      setSelectedConversationId(newConv.id);
    }
  };

  const sendMessage = (text: string) => {
    if (!selectedConversationId) return;
    
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: 'me',
      text,
      createdAt: new Date().toISOString()
    };

    setConversations(conversations.map(conv => {
      if (conv.id === selectedConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: text,
          lastMessageAt: newMessage.createdAt
        };
      }
      return conv;
    }));
  };

  const deleteConversation = (id: string) => {
    setConversations(conversations.filter(c => c.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black font-sans">
        <div className="w-16 h-16 mb-4 relative">
          <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-pink-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-zinc-500 font-medium animate-pulse">Intragram</p>
      </div>
    );
  }

  const followedPosts = posts.filter(post => myProfile.followingIds?.includes(post.profileId) && post.type !== 'video');
  const suggestedProfiles = profiles.filter(p => p.id !== myProfile.id && !myProfile.followingIds?.includes(p.id));

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col border-x border-zinc-800 relative overflow-hidden font-sans bg-black text-white">
      {!isOnline && (
        <div className="bg-zinc-900 text-zinc-500 text-[10px] py-1 text-center font-bold border-b border-zinc-800 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-pulse" />
          Offline Mode
        </div>
      )}
      {/* Header */}
      {activeTab !== 'reels' && (
        <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 sticky top-0 z-10 bg-black">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-zinc-900 to-zinc-700 flex items-center justify-center p-1.5 border border-zinc-800 shadow-lg">
              <div className="w-full h-full border-[1.8px] border-white rounded-[7px] relative flex items-center justify-center">
                <div className="w-2.5 h-2.5 border-[1.8px] border-white rounded-full"></div>
                <div className="absolute top-[1.5px] right-[1.5px] w-0.5 h-0.5 bg-white rounded-full"></div>
              </div>
            </div>
            <h1 className="text-xl font-bold tracking-tighter italic text-white">Intragram</h1>
          </div>
          <div className="flex items-center gap-4">
            <Send 
              size={24} 
              className="cursor-pointer" 
              onClick={() => setActiveTab('messages')}
            />
            <Menu 
              size={24} 
              className="cursor-pointer" 
              onClick={() => setActiveTab('settings')}
            />
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${activeTab === 'reels' ? 'overflow-hidden pb-0' : 'overflow-y-auto pb-16'}`}>
        {activeTab === 'home' && (
          <div className="flex flex-col">
            {/* Stories/Following List */}
            <div className="px-4 py-4 border-b border-zinc-900 overflow-x-auto flex gap-4 scrollbar-hide">
              {myProfile.followingIds?.length === 0 ? (
                <div className="flex flex-col gap-2">
                  <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Suggested for you</p>
                  <div className="flex gap-4">
                    {suggestedProfiles.slice(0, 5).map(profile => (
                      <div 
                        key={profile.id} 
                        className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
                        onClick={() => { setSelectedProfileId(profile.id); setActiveTab('profile'); }}
                      >
                        <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 to-purple-600">
                          <img 
                            src={profile.profilePic || `https://picsum.photos/seed/${profile.id}/200`} 
                            alt={profile.username}
                            className="w-full h-full rounded-full object-cover border-2 border-black"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-[10px] font-medium truncate w-16 text-center">{profile.username}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  {profiles.filter(p => myProfile.followingIds?.includes(p.id)).map(profile => (
                    <div 
                      key={profile.id} 
                      className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer"
                      onClick={() => { setSelectedProfileId(profile.id); setActiveTab('profile'); }}
                    >
                      <div className="w-16 h-16 rounded-full p-0.5 border-2 border-pink-500">
                        <img 
                          src={profile.profilePic || `https://picsum.photos/seed/${profile.id}/200`} 
                          alt={profile.username}
                          className="w-full h-full rounded-full object-cover border-2 border-black"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="text-[10px] font-medium truncate w-16 text-center">{profile.username}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Feed */}
            <div className="flex flex-col">
              {myProfile.followingIds?.length === 0 ? (
                <div className="flex flex-col p-4">
                  <h3 className="font-bold text-sm mb-4">Who to follow</h3>
                  <div className="space-y-4">
                    {suggestedProfiles.slice(0, 10).map(profile => (
                      <div key={profile.id} className="flex items-center justify-between">
                        <div 
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => { setSelectedProfileId(profile.id); setActiveTab('profile'); }}
                        >
                          <img 
                            src={profile.profilePic || `https://picsum.photos/seed/${profile.id}/200`} 
                            className="w-10 h-10 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-sm">{profile.username}</p>
                            <p className="text-xs text-zinc-500">{profile.fullName}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleFollow(profile.id)}
                          className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold"
                        >
                          Follow
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : followedPosts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-10 text-center">
                  <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
                    <ImageIcon className="text-zinc-700" size={32} />
                  </div>
                  <h3 className="font-bold text-lg mb-1">No posts yet</h3>
                  <p className="text-zinc-500 text-sm">The people you follow haven't posted anything yet.</p>
                  <button 
                    onClick={() => setActiveTab('search')}
                    className="mt-4 text-blue-500 font-bold text-sm"
                  >
                    Find more people to follow
                  </button>
                </div>
              ) : (
                followedPosts.map(post => (
                  <PostItem 
                    key={post.id} 
                    post={post} 
                    profile={profiles.find(p => p.id === post.profileId)} 
                    onToggleLike={() => toggleLike(post.id)}
                    onProfileClick={(id) => { setSelectedProfileId(id); setActiveTab('profile'); }}
                    onPostClick={(id) => {
                      setGalleryPosts(followedPosts);
                      setSelectedPostId(id);
                    }}
                    onCommentClick={(id) => setActiveCommentsPostId(id)}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'reels' && (
          <ReelsView 
            posts={posts} 
            profiles={profiles} 
            onToggleLike={toggleLike}
            onProfileClick={(id) => { setSelectedProfileId(id); setActiveTab('profile'); }}
            onCommentClick={(id) => setActiveCommentsPostId(id)}
          />
        )}

        {activeTab === 'profile' && selectedProfileId && (
          showSeeAllSuggested ? (
            <SeeAllSuggested 
              profiles={suggestedProfiles}
              myProfile={myProfile}
              onToggleFollow={toggleFollow}
              onProfileClick={(id) => { setSelectedProfileId(id); setShowSeeAllSuggested(false); }}
              onBack={() => setShowSeeAllSuggested(false)}
            />
          ) : (
            <ProfileView 
              profile={profiles.find(p => p.id === selectedProfileId)} 
              posts={posts.filter(p => p.profileId === selectedProfileId)}
              onBack={() => setActiveTab('home')}
              isFollowing={myProfile.followingIds?.includes(selectedProfileId)}
              onToggleFollow={() => toggleFollow(selectedProfileId)}
              onPostClick={(id) => {
                setGalleryPosts(posts.filter(p => p.profileId === selectedProfileId));
                setSelectedPostId(id);
              }}
              suggestedProfiles={suggestedProfiles.filter(p => p.id !== selectedProfileId)}
              myProfile={myProfile}
              onProfileClick={(id) => { setSelectedProfileId(id); }}
              onSeeAllSuggested={() => setShowSeeAllSuggested(true)}
              onMessageClick={() => {
                startNewConversation(selectedProfileId);
                setActiveTab('messages');
              }}
            />
          )
        )}

        {activeTab === 'my-profile' && (
          showSeeAllSuggested ? (
            <SeeAllSuggested 
              profiles={suggestedProfiles}
              myProfile={myProfile}
              onToggleFollow={toggleFollow}
              onProfileClick={(id) => { setSelectedProfileId(id); setActiveTab('profile'); setShowSeeAllSuggested(false); }}
              onBack={() => setShowSeeAllSuggested(false)}
            />
          ) : (
            <ProfileView 
              profile={myProfile} 
              posts={posts.filter(p => p.profileId === myProfile.id)}
              onBack={() => setActiveTab('home')}
              isOwnProfile={true}
              onEditProfile={() => setActiveTab('settings')}
              onPostClick={(id) => {
                setGalleryPosts(posts.filter(p => p.profileId === myProfile.id));
                setSelectedPostId(id);
              }}
              suggestedProfiles={suggestedProfiles}
              myProfile={myProfile}
              onProfileClick={(id) => { setSelectedProfileId(id); setActiveTab('profile'); }}
              onSeeAllSuggested={() => setShowSeeAllSuggested(true)}
            />
          )
        )}

        {activeTab === 'search' && (
          showSeeAllSuggested ? (
            <SeeAllSuggested 
              profiles={suggestedProfiles}
              myProfile={myProfile}
              onToggleFollow={toggleFollow}
              onProfileClick={(id) => { setSelectedProfileId(id); setActiveTab('profile'); setShowSeeAllSuggested(false); }}
              onBack={() => setShowSeeAllSuggested(false)}
            />
          ) : (
            <div className="flex flex-col h-full">
              <div className="p-4">
                <div className="bg-zinc-900 rounded-xl flex items-center px-3 py-2 gap-2 mb-4">
                  <Search size={18} className="text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Search profiles..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm w-full text-white"
                  />
                </div>

                {searchQuery ? (
                  <div className="space-y-4">
                    {profiles.filter(p => p.username.toLowerCase().includes(searchQuery.toLowerCase()) || p.fullName.toLowerCase().includes(searchQuery.toLowerCase())).map(profile => (
                      <div 
                        key={profile.id} 
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => { setSelectedProfileId(profile.id); setActiveTab('profile'); }}
                      >
                        <img 
                          src={profile.profilePic || `https://picsum.photos/seed/${profile.id}/200`} 
                          className="w-12 h-12 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-sm">{profile.username}</span>
                            {profile.isVerified && <CheckCircle2 size={14} className="text-blue-500 fill-blue-500 text-white" />}
                          </div>
                          <p className="text-xs text-zinc-500">{profile.fullName}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-1 auto-rows-[120px] mt-4">
                    {[...posts].filter(p => p.type !== 'video').sort(() => Math.random() - 0.5).map((post, index) => (
                      <SearchGridItem 
                        key={post.id} 
                        post={post} 
                        index={index}
                        onClick={() => { 
                          setGalleryPosts([post]); 
                          setSelectedPostId(post.id); 
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        )}
        {activeTab === 'settings' && (
          <SettingsView 
            onOpenDevPanel={() => setShowDevPanel(true)}
            onBack={() => setActiveTab('home')}
            myProfile={myProfile}
            setMyProfile={setMyProfile}
            onInstall={installApp}
            canInstall={!!deferredPrompt}
            isAppInstalled={isAppInstalled}
            isInIframe={isInIframe}
          />
        )}

        {activeTab === 'messages' && (
          <div className="h-full">
            {selectedConversationId ? (
              <ChatView 
                conversation={conversations.find(c => c.id === selectedConversationId)!}
                profile={profiles.find(p => p.id === conversations.find(c => c.id === selectedConversationId)!.profileId)!}
                onBack={() => setSelectedConversationId(null)}
                onSendMessage={sendMessage}
                onDeleteChat={(id) => {
                  deleteConversation(id);
                  setSelectedConversationId(null);
                }}
              />
            ) : (
              <MessagesView 
                profiles={profiles}
                conversations={conversations}
                onBack={() => setActiveTab('home')}
                onSelectConversation={(id) => setSelectedConversationId(id)}
                onStartNewConversation={startNewConversation}
                onDeleteConversation={deleteConversation}
              />
            )}
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      {(activeTab !== 'reels' && activeTab !== 'messages') && (
        <nav className={`flex items-center justify-around py-3 border-t border-gray-100 dark:border-zinc-800 sticky bottom-0 z-10 bg-inherit`}>
          <Home 
            size={26} 
            className={`cursor-pointer ${activeTab === 'home' ? 'text-black dark:text-white' : 'text-gray-400'}`} 
            onClick={() => setActiveTab('home')}
          />
          <Search 
            size={26} 
            className={`cursor-pointer ${activeTab === 'search' ? 'text-black dark:text-white' : 'text-gray-400'}`} 
            onClick={() => setActiveTab('search')}
          />
          <Clapperboard 
            size={26} 
            className={`cursor-pointer ${activeTab === 'reels' ? 'text-black dark:text-white' : 'text-gray-400'}`} 
            onClick={() => setActiveTab('reels')}
          />
          <Heart size={26} className="text-gray-400 cursor-pointer" />
          <User 
            size={26} 
            className={`cursor-pointer ${activeTab === 'my-profile' ? 'text-black dark:text-white' : 'text-gray-400'}`} 
            onClick={() => setActiveTab('my-profile')}
          />
        </nav>
      )}

      {activeTab === 'reels' && (
        <nav className="flex items-center justify-around py-3 sticky bottom-0 z-10 bg-black text-white">
          <Home 
            size={26} 
            className="cursor-pointer text-gray-400" 
            onClick={() => setActiveTab('home')}
          />
          <Search 
            size={26} 
            className="cursor-pointer text-gray-400" 
            onClick={() => setActiveTab('search')}
          />
          <Clapperboard 
            size={26} 
            className="cursor-pointer text-white" 
            onClick={() => setActiveTab('reels')}
          />
          <Heart size={26} className="text-gray-400 cursor-pointer" />
          <User 
            size={26} 
            className="cursor-pointer text-gray-400" 
            onClick={() => setActiveTab('my-profile')}
          />
        </nav>
      )}

      {/* Developer Panel Modal */}
      <AnimatePresence>
        {showDevPanel && (
          <DeveloperPanel 
            profiles={profiles}
            posts={posts}
            onClose={() => setShowDevPanel(false)}
            onAddProfile={addProfile}
            onUpdateProfile={updateProfile}
            onDeleteProfile={deleteProfile}
            onAddPost={addPost}
            onUpdatePost={updatePost}
            onDeletePost={deletePost}
            randomCommentCount={randomCommentCount}
            setRandomCommentCount={setRandomCommentCount}
            generateRandomComments={generateRandomComments}
          />
        )}
      </AnimatePresence>

      {/* Post Gallery Modal */}
      <AnimatePresence>
        {selectedPostId && (
          <PostGallery 
            posts={galleryPosts.length > 0 ? galleryPosts : posts}
            initialPostId={selectedPostId}
            profiles={profiles}
            onClose={() => {
              setSelectedPostId(null);
              setGalleryPosts([]);
            }}
            onToggleLike={toggleLike}
            onProfileClick={(id) => {
              setSelectedPostId(null);
              setGalleryPosts([]);
              setSelectedProfileId(id);
              setActiveTab('profile');
            }}
            onCommentClick={(id) => setActiveCommentsPostId(id)}
          />
        )}
      </AnimatePresence>

      {/* Comments Modal */}
      <AnimatePresence>
        {activeCommentsPostId && posts.find(p => p.id === activeCommentsPostId) && (
          <CommentsPanel 
            post={posts.find(p => p.id === activeCommentsPostId)!}
            onClose={() => setActiveCommentsPostId(null)}
            onAddComment={(text) => {
              setPosts(posts.map(p => {
                if (p.id === activeCommentsPostId) {
                  return {
                    ...p,
                    comments: [
                      {
                        id: Math.random().toString(36).slice(2, 11),
                        username: myProfile.username,
                        profilePic: myProfile.profilePic,
                        text,
                        createdAt: new Date().toISOString(),
                        likes: 0,
                        isLiked: false
                      },
                      ...(p.comments || [])
                    ]
                  };
                }
                return p;
              }));
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}



function ProfileView({ 
  profile, 
  posts, 
  onBack, 
  isOwnProfile, 
  onEditProfile, 
  isFollowing, 
  onToggleFollow, 
  onPostClick,
  suggestedProfiles,
  myProfile,
  onProfileClick,
  onSeeAllSuggested,
  onMessageClick
}: { 
  profile?: Profile, 
  posts: Post[], 
  onBack: () => void, 
  isOwnProfile?: boolean, 
  onEditProfile?: () => void, 
  isFollowing?: boolean, 
  onToggleFollow?: () => void, 
  onPostClick?: (id: string) => void,
  suggestedProfiles: Profile[],
  myProfile: Profile,
  onProfileClick: (id: string) => void,
  onSeeAllSuggested: () => void,
  onMessageClick?: () => void
}) {
  const [activeSubTab, setActiveSubTab] = useState<'posts' | 'reels'>('posts');
  const [showDiscover, setShowDiscover] = useState(true);
  
  if (!profile) return null;

  const filteredPosts = posts.filter(post => {
    if (activeSubTab === 'posts') return post.type !== 'video';
    if (activeSubTab === 'reels') return post.type === 'video';
    return true;
  });

  return (
    <div className="flex flex-col">
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center">
            {profile.profilePic ? (
              <img 
                src={profile.profilePic} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User size={40} className="text-zinc-700" />
            )}
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="font-bold">{profile.postsCount || 0}</p>
              <p className="text-xs text-zinc-500">Posts</p>
            </div>
            <div>
              <p className="font-bold">{formatNumber(profile.followers)}</p>
              <p className="text-xs text-zinc-500">Followers</p>
            </div>
            <div>
              <p className="font-bold">{formatNumber(profile.following)}</p>
              <p className="text-xs text-zinc-500">Following</p>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center gap-1 mb-1">
            <p className="font-bold text-sm">{profile.fullName}</p>
            {profile.isVerified && <CheckCircle2 size={14} className="text-blue-500 fill-blue-500 text-white" />}
          </div>
          <p className="text-sm text-zinc-500 mb-1">@{profile.username}</p>
          <p className="text-sm whitespace-pre-wrap">{profile.bio}</p>
        </div>
        <div className="flex gap-2">
          {isOwnProfile ? (
            <>
              <button 
                onClick={onEditProfile}
                className="flex-1 bg-zinc-900 py-2 rounded-lg text-sm font-bold"
              >
                Edit Profile
              </button>
              <button 
                onClick={() => setShowDiscover(!showDiscover)}
                className={`px-3 bg-zinc-900 rounded-lg flex items-center justify-center ${showDiscover ? 'bg-zinc-800' : ''}`}
              >
                <UserPlus size={18} />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={onToggleFollow}
                className={`flex-1 py-2 rounded-lg text-sm font-bold ${isFollowing ? 'bg-zinc-900 text-white' : 'bg-blue-500 text-white'}`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button 
                onClick={onMessageClick}
                className="flex-1 bg-zinc-900 py-2 rounded-lg text-sm font-bold"
              >
                Message
              </button>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isOwnProfile && showDiscover && suggestedProfiles.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <DiscoverPeople 
              profiles={suggestedProfiles.slice(0, 10)}
              myProfile={myProfile}
              onToggleFollow={onToggleFollow}
              onProfileClick={onProfileClick}
              onSeeAll={onSeeAllSuggested}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-zinc-900">
        <div className="flex justify-around border-b border-zinc-900">
          <button 
            onClick={() => setActiveSubTab('posts')}
            className={`flex-1 flex justify-center py-3 border-b-2 transition-colors ${activeSubTab === 'posts' ? 'border-white' : 'border-transparent'}`}
          >
            <Grid size={22} className={activeSubTab === 'posts' ? 'text-white' : 'text-zinc-500'} />
          </button>
          <button 
            onClick={() => setActiveSubTab('reels')}
            className={`flex-1 flex justify-center py-3 border-b-2 transition-colors ${activeSubTab === 'reels' ? 'border-white' : 'border-transparent'}`}
          >
            <Clapperboard size={22} className={activeSubTab === 'reels' ? 'text-white' : 'text-zinc-500'} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-0.5">
          {filteredPosts.length === 0 ? (
            <div className="col-span-3 py-20 flex flex-col items-center justify-center text-zinc-500">
              {activeSubTab === 'reels' ? (
                <>
                  <Clapperboard size={48} className="mb-2 opacity-20" />
                  <p className="text-sm font-medium">No reels yet</p>
                </>
              ) : (
                <>
                  <Grid size={48} className="mb-2 opacity-20" />
                  <p className="text-sm font-medium">No posts yet</p>
                </>
              )}
            </div>
          ) : (
            filteredPosts.map(post => (
              <GridItem 
                key={post.id} 
                post={post} 
                onPostClick={onPostClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsView({ 
  onOpenDevPanel, 
  onBack, 
  myProfile, 
  setMyProfile,
  onInstall,
  canInstall,
  isAppInstalled,
  isInIframe
}: { 
  onOpenDevPanel: () => void, 
  onBack: () => void, 
  myProfile: Profile, 
  setMyProfile: (p: Profile) => void,
  onInstall: () => void,
  canInstall: boolean,
  isAppInstalled: boolean,
  isInIframe: boolean
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(myProfile.fullName);
  const [username, setUsername] = useState(myProfile.username);
  const [bio, setBio] = useState(myProfile.bio);
  const [pic, setPic] = useState(myProfile.profilePic);

  const handleBackup = async () => {
    try {
      const data = await get(STORAGE_KEY);
      if (!data) {
        alert("No data found to backup!");
        return;
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `intragram-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Backup failed:", err);
      alert("Backup failed. See console for details.");
    }
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm("This will overwrite all current data. Are you sure?")) {
      e.target.value = '';
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          const data = JSON.parse(content);
          
          let safeData = { 
            profiles: [] as Profile[], 
            posts: [] as Post[], 
            conversations: [] as Conversation[], 
            myProfile: myProfile 
          };
          
          if (Array.isArray(data)) {
            // Fallback if the backup was somehow just an array of posts
            safeData.posts = data;
          } else if (typeof data === 'object' && data !== null) {
            safeData.profiles = Array.isArray(data.profiles) ? data.profiles : [];
            safeData.posts = Array.isArray(data.posts) ? data.posts : [];
            safeData.conversations = Array.isArray(data.conversations) ? data.conversations : [];
            if (data.myProfile) safeData.myProfile = data.myProfile;
          } else {
            throw new Error("Invalid backup file format.");
          }

          await set(STORAGE_KEY, safeData);
          alert("Data restored successfully! The app will now reload.");
          window.location.reload();
        } catch (err: any) {
          console.error("Restore failed during parsing:", err);
          alert(`Restore failed: ${err.message || 'Invalid file format'}`);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      console.error("Restore failed:", err);
      alert("Restore failed. See console for details.");
    }
  };

  const handleSave = () => {
    setMyProfile({
      ...myProfile,
      fullName: name,
      username,
      bio,
      profilePic: pic
    });
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isEditing) {
    return (
      <div className="flex flex-col h-full bg-black">
        <div className="px-4 py-4 flex items-center justify-between border-b border-zinc-900">
          <div className="flex items-center gap-4">
            <X size={24} className="cursor-pointer" onClick={() => setIsEditing(false)} />
            <h2 className="text-lg font-bold">Edit Profile</h2>
          </div>
          <button onClick={handleSave} className="text-blue-500 font-bold">Done</button>
        </div>
        <div className="p-4 space-y-6">
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-zinc-900 flex items-center justify-center relative group">
              {pic ? <img src={pic} className="w-full h-full object-cover" /> : <User size={40} className="text-zinc-700" />}
              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera size={20} className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            <button 
              onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
              className="text-blue-500 text-sm font-bold"
            >
              Change profile photo
            </button>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-zinc-500 font-medium">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full border-b border-zinc-800 bg-transparent py-2 outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-500 font-medium">Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} className="w-full border-b border-zinc-800 bg-transparent py-2 outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-500 font-medium">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full border-b border-zinc-800 bg-transparent py-2 outline-none focus:border-blue-500 resize-none h-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="px-4 py-4 flex items-center gap-4 border-b border-zinc-900">
        <ChevronLeft size={24} className="cursor-pointer" onClick={onBack} />
        <h2 className="text-lg font-bold">Settings</h2>
      </div>
      
      <div className="flex-1 p-4 space-y-6">
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Profile</h3>
          <div 
            className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            <div className="flex items-center gap-3">
              <User size={20} />
              <span className="font-medium">Edit Profile</span>
            </div>
            <ChevronLeft size={20} className="rotate-180 text-zinc-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Developer</h3>
          <div 
            className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl cursor-pointer"
            onClick={onOpenDevPanel}
          >
            <div className="flex items-center gap-3">
              <Settings size={20} />
              <span className="font-medium">Developer Options</span>
            </div>
            <ChevronLeft size={20} className="rotate-180 text-zinc-500" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">App</h3>
          <div 
            className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl cursor-pointer"
            onClick={onInstall}
          >
            <div className="flex items-center gap-3">
              <Download size={20} className={canInstall ? "text-blue-500" : "text-zinc-500"} />
              <div className="flex flex-col">
                <span className="font-medium">
                  {canInstall ? "Install App Now" : "App Installation"}
                </span>
                <span className={canInstall ? "text-[10px] text-blue-400" : "text-[10px] text-zinc-500"}>
                  {canInstall ? "Tap to add to home screen" : "Learn how to install manually"}
                </span>
              </div>
            </div>
            {isAppInstalled ? (
              <CheckCircle2 size={20} className="text-green-500" />
            ) : (
              <ChevronLeft size={20} className={`rotate-180 ${canInstall ? 'text-blue-500' : 'text-zinc-500'}`} />
            )}
          </div>
          <div className="px-4 space-y-2 py-1">
            {isInIframe && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl mb-4">
                <p className="text-[10px] text-red-400 font-bold mb-1">Preview Mode Detected</p>
                <p className="text-[10px] text-zinc-400">
                  You are viewing this app inside a preview frame. Native app installation cannot be triggered directly from here. 
                  Tap the button to open the app in a real browser tab first!
                </p>
              </div>
            )}
            <p className="text-[10px] text-zinc-600 leading-relaxed text-center px-4">
              {isAppInstalled 
                ? "You are using the official Intragram app! You can now use it offline and access it from your home screen." 
                : "PWAs work just like native apps. They run offline, have their own icon, and launch in full-screen."}
            </p>
            {!isAppInstalled && !canInstall && (
              <div className="bg-zinc-800/50 p-3 rounded-xl space-y-2">
                <p className="text-[10px] font-bold text-zinc-400">Android Installation Guide:</p>
                <ul className="text-[9px] text-zinc-500 space-y-1.5 list-none">
                  <li className="flex items-start gap-2">
                    <span className="bg-zinc-700 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] mt-0.5 shrink-0">1</span>
                    <span>Tap the <strong>three dots (⋮)</strong> at the top right of Chrome.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-zinc-700 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] mt-0.5 shrink-0">2</span>
                    <span>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-zinc-700 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] mt-0.5 shrink-0">3</span>
                    <span>Wait for the prompt and tap <strong>Install</strong>.</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Data Management</h3>
          <div 
            className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl cursor-pointer"
            onClick={handleBackup}
          >
            <div className="flex items-center gap-3">
              <Database size={20} className="text-green-500" />
              <span className="font-medium">Backup Data</span>
            </div>
            <Download size={18} className="text-zinc-500" />
          </div>
          <div 
            className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl cursor-pointer relative"
            onClick={() => document.getElementById('restore-input')?.click()}
          >
            <div className="flex items-center gap-3">
              <Upload size={20} className="text-orange-500" />
              <span className="font-medium">Restore Data</span>
            </div>
            <ChevronLeft size={20} className="rotate-180 text-zinc-500" />
            <input 
              id="restore-input"
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={handleRestore} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Storage</h3>
          <div 
            className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl cursor-pointer text-red-500"
            onClick={async () => {
              if (window.confirm("Are you sure you want to clear all app data? This will reset the app to its default state.")) {
                const { set } = await import('idb-keyval');
                await set(STORAGE_KEY, null);
                localStorage.removeItem(STORAGE_KEY);
                window.location.reload();
              }
            }}
          >
            <div className="flex items-center gap-3">
              <Trash2 size={20} />
              <span className="font-medium">Clear All Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentsPanel({ 
  post, 
  onClose, 
  onAddComment 
}: { 
  post: Post, 
  onClose: () => void,
  onAddComment: (text: string) => void
}) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddComment(text);
      setText('');
    }
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 bg-white dark:bg-black z-[100] flex flex-col"
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-zinc-900">
        <h2 className="text-lg font-bold">Comments</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {(!post.comments || post.comments.length === 0) ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle size={48} className="text-zinc-700 mb-4" />
            <h3 className="font-bold text-lg mb-2">No comments yet</h3>
            <p className="text-zinc-500 text-sm">Start the conversation.</p>
          </div>
        ) : (
          post.comments.map(comment => (
            <div key={comment.id} className="flex gap-3">
              <img 
                src={comment.profilePic || `https://picsum.photos/seed/${comment.username}/100`} 
                className="w-8 h-8 rounded-full object-cover mt-1"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-bold mr-2">{comment.username}</span>
                  {comment.text}
                </p>
                <div className="flex items-center gap-4 mt-1 text-xs text-zinc-500 font-medium">
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                  <span>{comment.likes || 0} likes</span>
                  <button className="font-bold">Reply</button>
                </div>
              </div>
              <Heart size={14} className="text-zinc-500 mt-2" />
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-zinc-900">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <img 
            src={`https://picsum.photos/seed/me/100`} 
            className="w-8 h-8 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
          <input 
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent border-none outline-none text-sm"
          />
          <button 
            type="submit"
            disabled={!text.trim()}
            className="text-blue-500 font-bold text-sm disabled:opacity-50"
          >
            Post
          </button>
        </form>
      </div>
    </motion.div>
  );
}

function DeveloperPanel({ 
  profiles, 
  posts, 
  onClose, 
  onAddProfile, 
  onUpdateProfile, 
  onDeleteProfile,
  onAddPost,
  onUpdatePost,
  onDeletePost,
  randomCommentCount,
  setRandomCommentCount,
  generateRandomComments
}: { 
  profiles: Profile[], 
  posts: Post[],
  onClose: () => void,
  onAddProfile: (p: Profile) => void,
  onUpdateProfile: (p: Profile) => void,
  onDeleteProfile: (id: string) => void,
  onAddPost: (p: Post) => void,
  onUpdatePost: (p: Post) => void,
  onDeletePost: (id: string) => void,
  randomCommentCount: number,
  setRandomCommentCount: (count: number) => void,
  generateRandomComments: (count: number) => any[]
}) {
  const [view, setView] = useState<'list' | 'create-profile' | 'create-post' | 'profile-posts'>('list');
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [viewingPostsForProfile, setViewingPostsForProfile] = useState<string | null>(null);

  // Form states
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [followers, setFollowers] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [profilePic, setProfilePic] = useState('');

  const [postProfileId, setPostProfileId] = useState('');
  const [postType, setPostType] = useState<'image' | 'video'>('image');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [postVideoUrl, setPostVideoUrl] = useState('');
  const [postImageUrlLink, setPostImageUrlLink] = useState('');
  const [postVideoUrlLink, setPostVideoUrlLink] = useState('');
  const [postCaption, setPostCaption] = useState('');
  const [postLikes, setPostLikes] = useState(0);
  const [postCommentsCount, setPostCommentsCount] = useState(randomCommentCount);
  const [isUploadingToCatbox, setIsUploadingToCatbox] = useState(false);

  const isDuplicateImage = useMemo(() => {
    if (!postImageUrlLink) return false;
    return posts.some(p => p.imageUrl === postImageUrlLink && p.id !== editingPostId);
  }, [postImageUrlLink, posts, editingPostId]);

  const isDuplicateVideo = useMemo(() => {
    if (!postVideoUrlLink) return false;
    return posts.some(p => p.videoUrl === postVideoUrlLink && p.id !== editingPostId);
  }, [postVideoUrlLink, posts, editingPostId]);

  const resetProfileForm = () => {
    setUsername('');
    setFullName('');
    setBio('');
    setFollowers(0);
    setIsVerified(false);
    setProfilePic('');
    setEditingProfileId(null);
  };

  const resetPostForm = () => {
    setPostProfileId(profiles[0]?.id || '');
    setPostType('image');
    setPostImageUrl('');
    setPostVideoUrl('');
    setPostImageUrlLink('');
    setPostVideoUrlLink('');
    setPostCaption('');
    setPostLikes(0);
    setEditingPostId(null);
  };

  const convertGDriveLink = (url: string, type: 'image' | 'video') => {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    
    // Only process Google Drive links for images
    if (type === 'image') {
      const match = url.match(/(?:id=|\/d\/|file\/d\/)([\w-]{25,})/);
      if (match && match[1]) {
        const id = match[1];
        // The thumbnail API is the ONLY 100% reliable way to hotlink Drive images
        return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
      }
    }
    
    // For videos (like Catbox.moe) or non-Drive images, return the raw URL
    return url;
  };

  const validateLink = (url: string, type: 'image' | 'video') => {
    if (!url) return;
    const converted = convertGDriveLink(url, type);
    if (type === 'image') setPostImageUrlLink(converted);
    else setPostVideoUrlLink(converted);
    
    // Simple visual feedback
    alert(`Link ${converted.includes('google') ? 'converted and ' : ''}validated!\n\nNote: Ensure your Google Drive file is set to "Anyone with the link can view".`);
  };

  const handlePaste = async (setter: (val: string) => void) => {
    try {
      const text = await navigator.clipboard.readText();
      setter(text);
    } catch (err) {
      console.error('Failed to read clipboard: ', err);
      // Fallback for some browsers or environments
      const text = prompt('Paste your link here:');
      if (text) setter(text);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void, isCatbox: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isCatbox) {
      setIsUploadingToCatbox(true);
      try {
        const formData = new FormData();
        formData.append('fileToUpload', file);

        const response = await fetch('/api/upload-catbox', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status}`);
        }

        const url = await response.text();
        setter(url);
      } catch (err) {
        console.error("Catbox upload failed:", err);
        alert("Failed to upload to Catbox. Falling back to local data URL.");
        // Fallback to local data URL logic below
        fallbackLocalUpload(file, setter);
      } finally {
        setIsUploadingToCatbox(false);
      }
    } else {
      fallbackLocalUpload(file, setter);
    }
  };

  const fallbackLocalUpload = (file: File, setter: (val: string) => void) => {
    // For videos, we don't compress for now, just read as data URL
    if (file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
      return;
    }

    // For images, compress using canvas
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Max dimension 800px to save space
        const maxDim = 800;
        if (width > height) {
          if (width > maxDim) {
            height *= maxDim / width;
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width *= maxDim / height;
            height = maxDim;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to 0.7 quality JPEG
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setter(compressedDataUrl);
        } else {
          setter(reader.result as string);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: Profile = {
      id: editingProfileId || Math.random().toString(36).slice(2, 11),
      username,
      fullName,
      bio,
      profilePic: profilePic || `https://picsum.photos/seed/${username}/400`,
      followers,
      following: Math.floor(Math.random() * 500),
      isVerified,
      postsCount: editingProfileId ? (profiles.find(p => p.id === editingProfileId)?.postsCount || 0) : 0
    };

    if (editingProfileId) {
      onUpdateProfile(newProfile);
    } else {
      onAddProfile(newProfile);
    }
    resetProfileForm();
    setView('list');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postProfileId) return;

    const existingPost = editingPostId ? posts.find(p => p.id === editingPostId) : null;
    
    let finalComments = existingPost?.comments || [];
    if (!existingPost) {
      finalComments = generateRandomComments(postCommentsCount);
    } else if (postCommentsCount !== (existingPost.comments?.length || 0)) {
      // If count changed, regenerate comments
      finalComments = generateRandomComments(postCommentsCount);
    }

    const newPost: Post = {
      id: editingPostId || Math.random().toString(36).slice(2, 11),
      profileId: postProfileId,
      type: postType,
      imageUrl: postImageUrlLink || postImageUrl || (existingPost ? existingPost.imageUrl : `https://picsum.photos/seed/${Math.random()}/800`),
      videoUrl: postType === 'video' ? (postVideoUrlLink || postVideoUrl || (existingPost ? existingPost.videoUrl : undefined)) : undefined,
      caption: postCaption,
      likes: postLikes,
      createdAt: existingPost ? existingPost.createdAt : new Date().toISOString(),
      comments: finalComments
    };

    if (editingPostId) {
      onUpdatePost(newPost);
    } else {
      onAddPost(newPost);
    }
    resetPostForm();
    if (viewingPostsForProfile) {
      setView('profile-posts');
    } else {
      setView('list');
    }
  };

  const startEdit = (profile: Profile) => {
    setEditingProfileId(profile.id);
    setUsername(profile.username);
    setFullName(profile.fullName);
    setBio(profile.bio);
    setFollowers(profile.followers);
    setIsVerified(profile.isVerified);
    setProfilePic(profile.profilePic);
    setView('create-profile');
  };

  const startEditPost = (post: Post) => {
    setEditingPostId(post.id);
    setPostProfileId(post.profileId);
    setPostType(post.type);
    setPostImageUrlLink(post.imageUrl.startsWith('http') ? post.imageUrl : '');
    setPostImageUrl(post.imageUrl.startsWith('data:') ? post.imageUrl : '');
    if (post.videoUrl) {
      setPostVideoUrlLink(post.videoUrl.startsWith('http') ? post.videoUrl : '');
      setPostVideoUrl(post.videoUrl.startsWith('data:') ? post.videoUrl : '');
    } else {
      setPostVideoUrlLink('');
      setPostVideoUrl('');
    }
    setPostCaption(post.caption || '');
    setPostLikes(post.likes);
    setPostCommentsCount(post.comments?.length || randomCommentCount);
    setView('create-post');
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 bg-white dark:bg-black z-50 flex flex-col"
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-zinc-900">
        <h2 className="text-lg font-bold">Developer Panel</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {view === 'list' && (
          <div className="space-y-6">
            <div className="flex gap-2">
              <button 
                onClick={() => setView('create-profile')}
                className="flex-1 bg-black dark:bg-white dark:text-black text-white py-3 rounded-xl font-bold text-sm"
              >
                Create Profile
              </button>
              <button 
                onClick={() => {
                  if (profiles.length > 0) {
                    setPostProfileId(profiles[0].id);
                    setView('create-post');
                  } else {
                    alert('Create a profile first!');
                  }
                }}
                className="flex-1 bg-gray-100 dark:bg-zinc-900 py-3 rounded-xl font-bold text-sm"
              >
                Create Post
              </button>
            </div>

            <div>
              <h3 className="font-bold mb-3 text-gray-400 uppercase text-[10px] tracking-widest">Settings</h3>
              <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">Random Comments Count</p>
                    <p className="text-xs text-gray-500">Number of comments to generate per post</p>
                  </div>
                  <input 
                    type="number" 
                    value={randomCommentCount}
                    onChange={(e) => setRandomCommentCount(parseInt(e.target.value) || 0)}
                    className="w-16 bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-lg px-2 py-1 text-center font-bold"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-3 text-gray-400 uppercase text-[10px] tracking-widest">Manage Profiles</h3>
              {profiles.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No profiles yet.</p>
              ) : (
                <div className="space-y-3">
                  {profiles.map(p => (
                    <div key={p.id} className="flex items-center justify-between bg-gray-50 dark:bg-zinc-900 p-3 rounded-xl">
                      <div className="flex items-center gap-3">
                        <img src={p.profilePic} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <p className="font-bold text-sm">{p.username}</p>
                          <p className="text-xs text-gray-500">{formatNumber(p.followers)} followers</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setViewingPostsForProfile(p.id);
                            setView('profile-posts');
                          }} 
                          className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg text-green-600"
                          title="Manage Posts"
                        >
                          <Grid size={18} />
                        </button>
                        <button onClick={() => startEdit(p)} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg text-blue-600">
                          <Settings size={18} />
                        </button>
                        <button onClick={() => onDeleteProfile(p.id)} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg text-red-600">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'profile-posts' && viewingPostsForProfile && (
          <div className="space-y-4 pb-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full">
                  <ChevronLeft size={24} />
                </button>
                <h3 className="font-bold text-lg">
                  Posts by @{profiles.find(p => p.id === viewingPostsForProfile)?.username}
                </h3>
              </div>
              <button 
                onClick={() => {
                  resetPostForm();
                  setPostProfileId(viewingPostsForProfile);
                  setView('create-post');
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2"
              >
                <PlusSquare size={16} />
                Upload Post
              </button>
            </div>

            {posts.filter(p => p.profileId === viewingPostsForProfile).length === 0 ? (
              <p className="text-sm text-gray-400 italic">No posts for this profile yet.</p>
            ) : (
              <div className="space-y-3">
                {posts.filter(p => p.profileId === viewingPostsForProfile).map(post => (
                  <div key={post.id} className="flex items-center justify-between bg-gray-50 dark:bg-zinc-900 p-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <img src={post.imageUrl} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-bold text-sm truncate w-32">{post.caption || 'No caption'}</p>
                        <p className="text-xs text-gray-500">{post.type === 'video' ? 'Reel' : 'Image'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditPost(post)} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg text-blue-600">
                        <Settings size={18} />
                      </button>
                      <button onClick={() => onDeletePost(post.id)} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'create-profile' && (
          <form onSubmit={handleCreateProfile} className="space-y-4 pb-10">
            <h3 className="font-bold text-lg">{editingProfileId ? 'Edit Profile' : 'New Profile'}</h3>
            
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-zinc-900 relative overflow-hidden border-2 border-gray-200 dark:border-zinc-800">
                {profilePic ? (
                  <img src={profilePic} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={40} className="text-gray-300" />
                  </div>
                )}
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={24} className="text-white" />
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, setProfilePic)} />
                </label>
              </div>
              <button 
                type="button"
                onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                className="text-blue-500 text-sm font-bold"
              >
                Upload Profile Photo
              </button>
              <div className="w-full space-y-2 mt-2">
                <label className="text-xs font-bold text-gray-500 uppercase text-center block">Or Paste Image URL</label>
                <input 
                  type="url"
                  value={profilePic}
                  onChange={e => setProfilePic(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-black dark:ring-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
              <input 
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. johndoe"
                className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-black dark:ring-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
              <input 
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-black dark:ring-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Bio</label>
              <textarea 
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Profile bio..."
                className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-black dark:ring-white h-24 resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Followers Count</label>
              <input 
                type="number"
                value={followers}
                onChange={e => setFollowers(parseInt(e.target.value) || 0)}
                className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-black dark:ring-white"
              />
            </div>
            <div className="flex items-center gap-3 py-2">
              <input 
                type="checkbox"
                id="verified"
                checked={isVerified}
                onChange={e => setIsVerified(e.target.checked)}
                className="w-5 h-5 accent-blue-500"
              />
              <label htmlFor="verified" className="text-sm font-bold">Verified Badge</label>
            </div>
            <div className="flex gap-2 pt-4">
              <button 
                type="button"
                onClick={() => { resetProfileForm(); setView('list'); }}
                className="flex-1 bg-gray-100 dark:bg-zinc-900 py-3 rounded-xl font-bold text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 bg-black dark:bg-white dark:text-black text-white py-3 rounded-xl font-bold text-sm"
              >
                {editingProfileId ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        )}

        {view === 'create-post' && (
          <form onSubmit={handleCreatePost} className="space-y-4 pb-10">
            <h3 className="font-bold text-lg">{editingPostId ? 'Edit Post' : 'New Post'}</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Select Profile</label>
              <select 
                required
                value={postProfileId}
                onChange={e => setPostProfileId(e.target.value)}
                className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-black dark:ring-white appearance-none"
              >
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>@{p.username}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Video Hosting Help</label>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-800/30">
                <p className="text-[10px] text-blue-600 dark:text-blue-400 leading-relaxed">
                  1. For videos, we recommend using <strong>Catbox.moe</strong> or direct .mp4 links.<br/>
                  2. Google Drive links are not recommended for videos as they degrade quality and may fail.<br/>
                  3. Paste the direct link and click <strong>Validate</strong>.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Post Type</label>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setPostType('image')}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${postType === 'image' ? 'bg-black dark:bg-white dark:text-black text-white' : 'bg-gray-100 dark:bg-zinc-900 text-zinc-500'}`}
                >
                  Image
                </button>
                <button 
                  type="button"
                  onClick={() => setPostType('video')}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${postType === 'video' ? 'bg-black dark:bg-white dark:text-black text-white' : 'bg-gray-100 dark:bg-zinc-900 text-zinc-500'}`}
                >
                  Video
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">{postType === 'image' ? 'Image Source (Direct link recommended)' : 'Thumbnail Source'}</label>
              <div className="flex gap-2 mb-2">
                <input 
                  value={postImageUrlLink}
                  onChange={e => setPostImageUrlLink(e.target.value)}
                  placeholder="Paste direct link (.jpg, .png) or Google Drive..."
                  className="flex-1 bg-gray-50 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-black dark:ring-white"
                />
                <div className="flex flex-col gap-1">
                  <button 
                    type="button"
                    onClick={() => handlePaste(setPostImageUrlLink)}
                    className="bg-zinc-800 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold"
                  >
                    Paste
                  </button>
                  <button 
                    type="button"
                    onClick={() => validateLink(postImageUrlLink, 'image')}
                    className="bg-blue-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold"
                  >
                    Validate
                  </button>
                </div>
                {postImageUrlLink && (
                  <button 
                    type="button"
                    onClick={() => window.open(postImageUrlLink, '_blank')}
                    className="bg-zinc-800 text-white px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    Test
                  </button>
                )}
              </div>
              {isDuplicateImage && (
                <p className="text-red-500 text-[10px] font-bold mt-1 px-1">
                  This image link has already been uploaded in another post!
                </p>
              )}
              <p className="text-[10px] text-zinc-500 px-1 mb-2">OR upload directly to Catbox.moe</p>
              <div 
                onClick={() => !isUploadingToCatbox && document.getElementById('post-file')?.click()}
                className={`w-full min-h-[200px] bg-gray-50 dark:bg-zinc-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-zinc-800 flex flex-col items-center justify-center cursor-pointer overflow-hidden ${isUploadingToCatbox ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {isUploadingToCatbox ? (
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm text-blue-500 font-bold">Uploading to Catbox...</p>
                  </div>
                ) : postImageUrlLink || postImageUrl ? (
                  <img src={postImageUrlLink || postImageUrl} className="w-full h-auto block" referrerPolicy="no-referrer" />
                ) : (
                  <>
                    <Upload size={48} className="text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">Click to upload image to Catbox</p>
                  </>
                )}
                <input id="post-file" type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, setPostImageUrlLink, true)} />
              </div>
            </div>

            {postType === 'video' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Video Source (Direct .mp4 recommended)</label>
                <div className="flex gap-2 mb-2">
                  <input 
                    value={postVideoUrlLink}
                    onChange={e => setPostVideoUrlLink(e.target.value)}
                    placeholder="Paste direct link (.mp4) or Catbox.moe..."
                    className="flex-1 bg-gray-50 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-black dark:ring-white"
                  />
                  <div className="flex flex-col gap-1">
                    <button 
                      type="button"
                      onClick={() => handlePaste(setPostVideoUrlLink)}
                      className="bg-zinc-800 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold"
                    >
                      Paste
                    </button>
                    <button 
                      type="button"
                      onClick={() => validateLink(postVideoUrlLink, 'video')}
                      className="bg-blue-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold"
                    >
                      Validate
                    </button>
                    {postVideoUrlLink && (
                      <button 
                        type="button"
                        onClick={() => window.open(postVideoUrlLink, '_blank')}
                        className="bg-zinc-800 text-white px-3 py-2 rounded-xl text-[10px] font-bold"
                      >
                        Test
                      </button>
                    )}
                  </div>
                </div>
                {isDuplicateVideo && (
                  <p className="text-red-500 text-[10px] font-bold mt-1 px-1">
                    This video link has already been uploaded in another post!
                  </p>
                )}
                <p className="text-[10px] text-zinc-500 px-1 mb-2">OR upload directly to Catbox.moe</p>
                <div 
                  onClick={() => !isUploadingToCatbox && document.getElementById('post-video-file')?.click()}
                  className={`w-full aspect-video bg-gray-50 dark:bg-zinc-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-zinc-800 flex flex-col items-center justify-center cursor-pointer overflow-hidden ${isUploadingToCatbox ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {isUploadingToCatbox ? (
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p className="text-sm text-blue-500 font-bold">Uploading to Catbox...</p>
                    </div>
                  ) : postVideoUrlLink || postVideoUrl ? (
                    <video src={postVideoUrlLink || postVideoUrl} className="w-full h-full object-cover" controls playsInline referrerPolicy="no-referrer" />
                  ) : (
                    <>
                      <Upload size={48} className="text-gray-300 mb-2" />
                      <p className="text-sm text-gray-400">Click to upload video to Catbox</p>
                    </>
                  )}
                  <input id="post-video-file" type="file" accept="video/*" className="hidden" onChange={e => handleFileUpload(e, setPostVideoUrlLink, true)} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Caption</label>
              <textarea 
                value={postCaption}
                onChange={e => setPostCaption(e.target.value)}
                placeholder="Write a caption..."
                className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-black dark:ring-white h-24 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Initial Likes</label>
              <input 
                type="number"
                value={postLikes}
                onChange={e => setPostLikes(parseInt(e.target.value) || 0)}
                className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-black dark:ring-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Random Comments Count</label>
              <input 
                type="number"
                value={postCommentsCount}
                onChange={e => setPostCommentsCount(parseInt(e.target.value) || 0)}
                className="w-full bg-gray-50 dark:bg-zinc-900 border-none rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-black dark:ring-white"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button 
                type="button"
                onClick={() => { 
                  resetPostForm(); 
                  if (viewingPostsForProfile) {
                    setView('profile-posts');
                  } else {
                    setView('list');
                  }
                }}
                className="flex-1 bg-gray-100 dark:bg-zinc-900 py-3 rounded-xl font-bold text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 bg-black dark:bg-white dark:text-black text-white py-3 rounded-xl font-bold text-sm"
              >
                {editingPostId ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}
