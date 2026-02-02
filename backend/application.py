"""
AWS Elastic Beanstalk entry point
EB looks for 'application' variable in application.py
"""
from run import app as application

if __name__ == "__main__":
    application.run()
