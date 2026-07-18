from app.database.database import SessionLocal
from app.models.employee import Employee

db = SessionLocal()

employees = db.query(Employee).all()

for emp in employees:
    print(emp.EmployeeName, "-", emp.RoleType)

db.close()