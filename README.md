# blog.dawndash.ovh

Run dev server at http://localhost:8080/: 
```
npm run dev
```


Build source :
```
npm run build
```

Deploy :

```
rsync -rav --delete blog/.vuepress/dist/* guillaumeh@dawndash.ovh:/home/guillaumeh/blog/
```