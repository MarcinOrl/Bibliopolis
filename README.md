# BookReviewPlatform
Web application for reviewing books. Project for the subject 'Designing web applications'.

## Installation

1. Clone repository
   
    `git clone https://github.com/MarcinOrl/book-review-platform.git`
   
3. Change directory
   
    `cd book-review-platform`
   
3. Create virtual environment
   
    `python -m venv venv`
   
    `venv\Scripts\activate (Windows)`
   
    `source venv/bin/activate (macOS/Linux)`
   
4. Install requirements
   
    `pip install -r requirements.txt`

5. Change directory
   
    `cd frontend`
   
6. Install npm dependencies
    
    `npm install`

7. Migrate the DB in backend folder

    `python manage.py migrate`
   
8. Run django server

    `python manage.py runserver`

9. Run Next.js in frontend folder

    `npm run dev`

10. Optionally create superuser

    `python manage.py createsuperuser`
