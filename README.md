# MongoExpressOpg

Øvelse: Fetch-opgaven (CRUD med Fetch, Node.js og MongoDB)
I skal prøve at forbinde tre emner vi har arbejdet med: Fetch, Node.js og MongoDB.
 
I skal have en tabel i MongoDB, der repræsenterer et eller andet. Det kunne være studerende, biler, produkter eller hvad I synes.
 
Node.js skal have adgang til denne database ved brug af Mongoose.
 
Der skal laves en API med Express, der giver CRUD adgang til denne tabel.
 
På klientsiden skal der laves en brugergrænseflade, hvor man kan udføre CRUD operationerne. Hvis det f.eks. var biler det drejede sig om, skal man kunne oprette, redigere, slette og søge efter biler.
 
I må meget gerne løse opgaven i grupper.
 
Ekstra: Lav authentication og authorization med JWT, så man skal være logget ind, for at kunne udføre create, update og delete, mens man kan lave read (f.eks. se en oversigt over biler) uden at være logget ind.

# Setup
1. Sørg for at have MongoDB kørende lokalt.
2. Installer dependencies:
	```bash
	npm install
	```
3. Start applikationen:
	```bash
	npm start
	```
4. Åbn i browser:
	```
	http://localhost:3000
	```

## API endpoints

- `GET /api/students` - Hent alle studerende - R
- `GET /api/students?q=tekst` - Søg i navn, email og hold - R
- `GET /api/students/:id` - Hent én studerende - R
- `POST /api/students` - Opret studerende - C
- `PUT /api/students/:id` - Opdater studerende - U
- `DELETE /api/students/:id` - Slet studerende - D