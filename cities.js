---
---
var poi = [
    {% for item in site.categories.countries %}
    {
        "geometry": {
        "type": "Point",
        "coordinates": [{{item.lon}}, {{item.lat}}]
    },
    "properties": {
        "url": "{{item.permalink}}",
        "klass": "{{item.title | downcase | replace: ',', ''| replace:' ','-'}}",
        "title": "{{item.title}}",
        "projects": [{% for case in site.categories.casestudy %}{% for tag in case.tags %}{% if tag == item.country %}'{{tag}}',{% endif %}{% endfor %}{% endfor %}false
        ]}
    }{% unless forloop.last %},{% endunless %}
    {% endfor %}
];
