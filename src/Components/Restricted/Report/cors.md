# allow CORS in GS bucket

create json file `cors-config.json`

```javascript
[
  {
    origin: ['https://siemprelistos.web.app', 'https://conbuenaenergia.web.app'],
    method: ['GET'],
    maxAgeSeconds: 3600,
  },
];
```

use gsutil tool

```powershell
gsutil cors set cors-config.json gs://myappt51.appspot.com

```
