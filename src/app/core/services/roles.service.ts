import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthModel } from '../models/auth.model';
import { isUserInAnyRole, isUserInEveryRole, isUserInRole } from '../security/security.functions';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class RolesService<T extends string = string> {
    private initialized: boolean = false;
    private readonly rolesSubject = new BehaviorSubject<T[]>([]);

    constructor(private readonly authService: AuthService) {
        this.init();
    }

    init(): void {
        if (!this.initialized) {
            const data = this.authService.getAuth();
            if (data) {
                const oldRole: any = this.rolesSubject.value;
                this.rolesSubject.next([...oldRole, data.userType]);
            }
            this.initialized = true;
        }
    }

    public setAuthRoles(roles: any[]): void {
        this.rolesSubject.next(roles);
        if(roles[0].includes('ROLE_ADMIN')){
            localStorage.setItem('role' , 'ROLE_ADMIN');
        }
        if(roles[0].includes('ROLE_USER_OPERATOR')){
            localStorage.setItem('role' , 'ROLE_USER_OPERATOR');
        }
    }
    public setUserRoles(roles: any[]): void {
        this.rolesSubject.next(roles);
        if(roles[0].includes('ROLE_USER_TRANSPORT')){
            localStorage.setItem('userRole' , 'ROLE_USER_TRANSPORT');
        }
        if(roles[0].includes('ROLE_USER_AGENT')){
            localStorage.setItem('userRole' , 'ROLE_USER_AGENT');
        }
        if(roles[0].includes('ROLE_USER_MANEUVERING')){
            localStorage.setItem('userRole' , 'ROLE_USER_MANEUVERING');
        }
    }

    public addUserRoles(roles: T[]): void {
        this.rolesSubject.next([...roles]);
    }

    public addUserRole(role: T): void {
        const oldRole = this.rolesSubject.value;
        this.rolesSubject.next([...oldRole, role]);
    }

    public getAuthRoles(): any {
        let role = localStorage.getItem('role')
        if(role) return role
        else return this.rolesSubject.value;
    }

    public getUserRoles(): any {
        let role = localStorage.getItem('userRole')
        if(role) return role
        else return this.rolesSubject.value;
    }

    public listenToUserRoles(): Observable<T[]> {
        return this.rolesSubject.asObservable();
    }

    public isUserInRole(role: T): boolean {
        return isUserInRole(this.getAuthRoles(), role);
    }

    public isUserInAnyRole(roles: T[]): boolean {
        return isUserInAnyRole(this.getAuthRoles(), roles);
    }

    public isUserInEveryRole(roles: T[]): boolean {
        return isUserInEveryRole(this.getAuthRoles(), roles);
    }

    public removeUserRoles(): any {
        let role = localStorage.getItem('role');
        if(role) localStorage.removeItem('role');
        let userRole = localStorage.getItem('userRole');
        if(userRole) localStorage.removeItem('userRole');
    }

}
